package com.example.deeplink_callback_test

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.net.nsd.NsdManager
import android.net.nsd.NsdServiceInfo
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import org.java_websocket.WebSocket
import org.java_websocket.handshake.ClientHandshake
import org.java_websocket.server.WebSocketServer
import java.io.IOException
import java.net.InetSocketAddress
import java.net.ServerSocket

class WebSocketServerService : Service() {
    private var webSocketServer: CustomWebSocketServer? = null
    private lateinit var nsdManager: NsdManager
    private lateinit var webSocketServerRegistrationListener: NsdManager.RegistrationListener

    private val TAG = "WebSocketServerService"
    private val SERVICE_NAME = "MyWebSocketServer"
    private val SERVICE_TYPE = "_ws._tcp"

    private val NOTIFICATION_CHANNEL_ID = "WebSocketServerServiceChannel"
    private val NOTIFICATION_ID = 1


    override fun onBind(intent: Intent): IBinder? {
        return null
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        startWebSocketServer()

        // Create notification for foreground service
        createNotificationChannel()
        val notification = NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID)
            .setContentTitle("WebSocket Server")
            .setContentText("Running")
            .setPriority(NotificationCompat.PRIORITY_MIN)
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .build()
        startForeground(NOTIFICATION_ID, notification)

        return START_NOT_STICKY
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "WebSocket Server Service"
            val description = "WebSocket Server Service Channel"
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(NOTIFICATION_CHANNEL_ID, name, importance)
            channel.description = description
            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)
        }
    }

    private fun startWebSocketServer() {
        val port = findAvailablePort() ?: run {
            Log.e(TAG, "Failed to find an available port")
            return
        }

        nsdManager = getSystemService(Context.NSD_SERVICE) as NsdManager
        webSocketServerRegistrationListener = object : NsdManager.RegistrationListener {
            override fun onRegistrationFailed(serviceInfo: NsdServiceInfo?, errorCode: Int) {
                Log.e(TAG, "Failed to register service: $errorCode")
            }

            override fun onServiceRegistered(serviceInfo: NsdServiceInfo?) {
                Log.i(TAG, "Service registered: $serviceInfo")
            }

            override fun onServiceUnregistered(serviceInfo: NsdServiceInfo?) {
                Log.i(TAG, "Service unregistered: $serviceInfo")
            }

            override fun onUnregistrationFailed(serviceInfo: NsdServiceInfo?, errorCode: Int) {
                Log.e(TAG, "Failed to unregister service: $errorCode")
            }
        }

        webSocketServer = CustomWebSocketServer(InetSocketAddress(port)).apply {
            start()
        }

        val serviceInfo = NsdServiceInfo().apply {
            serviceName = SERVICE_NAME
            serviceType = SERVICE_TYPE
            setPort(port)
        }

        nsdManager.registerService(
            serviceInfo,
            NsdManager.PROTOCOL_DNS_SD,
            webSocketServerRegistrationListener
        )
    }

    private fun findAvailablePort(): Int? {
        return (1024..65535).find { port ->
            try {
                ServerSocket(port).use { serverSocket -> return port }
            } catch (e: IOException) {
                // Port is not available
            }
            false
        }
    }

    override fun onDestroy() {
        webSocketServer?.stop()
        nsdManager.apply {
            unregisterService(webSocketServerRegistrationListener)
        }
    }

    private inner class CustomWebSocketServer(address: InetSocketAddress) :
        WebSocketServer(address) {
        override fun onOpen(conn: WebSocket, handshake: ClientHandshake) {
            Log.i(TAG, "WebSocket connection opened: ${conn.remoteSocketAddress}")
        }

        override fun onClose(conn: WebSocket, code: Int, reason: String, remote: Boolean) {
            Log.i(TAG, "WebSocket connection closed: ${conn.remoteSocketAddress}")
        }

        override fun onMessage(conn: WebSocket, message: String) {
            Log.i(TAG, "Message received: $message")
            // Handle incoming messages here
        }

        override fun onError(conn: WebSocket?, ex: Exception) {
            Log.e(TAG, "WebSocket error", ex)
        }

        override fun onStart() {
            Log.i(TAG, "WebSocket server started on port $port")
        }
    }
}
