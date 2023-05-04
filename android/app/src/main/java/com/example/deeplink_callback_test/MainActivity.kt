package com.example.deeplink_callback_test

import android.content.Intent
import android.net.Uri
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.TextView

class MainActivity : AppCompatActivity() {
    private lateinit var paramTextView: TextView
    private lateinit var callbackUrlTextView: TextView
    private lateinit var responseTextView: TextView

    private lateinit var callbackUrl: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Start the WebSocketServerService as a foreground service
        val intent = Intent(this, WebSocketServerService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(intent)
        } else {
            startService(intent)
        }

        // Find views by ID
        paramTextView = findViewById(R.id.param_text_view)
        callbackUrlTextView = findViewById(R.id.callback_url_text_view)
        responseTextView = findViewById(R.id.response_text_view)
        val generateButton = findViewById<Button>(R.id.generate_button)
        val callbackButton = findViewById<Button>(R.id.callback_button)

        // Handle deep link intent
        val data = intent.data
        if (data != null) {
            val param = data.getQueryParameter("param")
            val callbackUrl = data.getQueryParameter("callback_url")
            if (callbackUrl != null) {
                this.callbackUrl = callbackUrl
                paramTextView.text = "Param: $param"
                callbackUrlTextView.text = "Callback URL: $callbackUrl"
            }
        }

        // Generate random value and show on response TextView
        generateButton.setOnClickListener {
            val randomValue = (1..100).random()
            responseTextView.text = "Response: $randomValue"
        }

        // Trigger callback with response data
        callbackButton.setOnClickListener {
            if (::callbackUrl.isInitialized) {
                val response = responseTextView.text.toString().substringAfter(": ").toInt()
                val callbackUri = Uri.parse(callbackUrl)
                    .buildUpon()
                    .appendQueryParameter("response", response.toString())
                    .build()
                val intent = Intent(Intent.ACTION_VIEW, callbackUri)
                startActivity(intent)
            }
        }
    }
}
