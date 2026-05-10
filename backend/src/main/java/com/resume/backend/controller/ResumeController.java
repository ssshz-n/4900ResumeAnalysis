package com.resume.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.resume.backend.service.PDFParser;
import com.resume.backend.service.DOCXParser;
import com.resume.backend.service.GeminiService;

import org.json.JSONObject;

//To handle API requests
@RestController
@CrossOrigin(origins = "*")
public class ResumeController {
    @Autowired
    private GeminiService geminiService;

    @PostMapping("/upload")
    public String uploadResume(@RequestParam("file") MultipartFile file) {
        try{
            String filename = file.getOriginalFilename();
            String extractedText = "";

            if(filename != null && filename.toLowerCase().endsWith(".pdf")){
                extractedText = PDFParser.parse(file.getInputStream());
            }
            else if(filename != null && filename.toLowerCase().endsWith(".docx")){
                extractedText = DOCXParser.parse(file.getInputStream());
            }
            else{
                return "Unsupported file type. Please upload a PDF or DOCX file:)";
            }

            String aiAnalysis = geminiService.analyzeResume(extractedText);

            JSONObject resultJson = new JSONObject();
            resultJson.put("candidate",aiAnalysis);

            return resultJson.toString();
        }
        catch(Exception e){
            JSONObject errJson = new JSONObject();
            errJson.put("candidate","Error processing file: " + e.getMessage());
            return errJson.toString();
        }
    }
}