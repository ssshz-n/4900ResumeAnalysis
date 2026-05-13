package com.resume.backend.service;

import java.io.IOException;
import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {
    @Value("${gemini.api.key}")
    private String apiKey;

    private final OkHttpClient client = new OkHttpClient();

    public String getAiResponse(String userInput, String type) throws IOException {
        
        String systemInstruction;
        
        if ("resume".equalsIgnoreCase(type)) {
            systemInstruction = """
                Analyze this resume. 
                Return: 1. Missing skills, 2. Improvement suggestions. 
                Keep the response concise and professional.
                Resume Content:
                """;
        } else {
            systemInstruction = """
                You are a helpful, professional, and friendly AI Career Coach for ResumeAnalyzer. 
                Answer the user's career questions, help them with interview prep, or just chat professionally.
                Keep it conversational but career-focused.
                User says:
                """;
        }

        String fullPrompt = systemInstruction + userInput;

        JSONObject textPart = new JSONObject();
        textPart.put("text", fullPrompt);

        JSONArray partsArray = new JSONArray();
        partsArray.put(textPart);

        JSONObject contentObject = new JSONObject();
        contentObject.put("parts", partsArray);

        JSONArray contentsArray = new JSONArray();
        contentsArray.put(contentObject);

        JSONObject requestBodyJson = new JSONObject();
        requestBodyJson.put("contents", contentsArray);

        RequestBody body = RequestBody.create(
                requestBodyJson.toString(),
                MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
                .url("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + apiKey)
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body().string();
            JSONObject json = new JSONObject(responseBody);

            if (!json.has("candidates")) {
                return "Gemini Error: " + responseBody;
            }

            return json
                    .getJSONArray("candidates")
                    .getJSONObject(0)
                    .getJSONObject("content")
                    .getJSONArray("parts")
                    .getJSONObject(0)
                    .getString("text");
        }
    }
}