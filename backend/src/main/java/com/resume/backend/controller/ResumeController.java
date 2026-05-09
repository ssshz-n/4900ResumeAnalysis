package com.resume.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.resume.backend.service.PDFParser;
import com.resume.backend.service.DOCXParser;

//To handle API requests
@RestController
@CrossOrigin(origins = "*")
public class ResumeController {
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

            return extractedText;
        }
        catch(Exception e){
            return "Error processing file: " + e.getMessage();
        }
    }
}