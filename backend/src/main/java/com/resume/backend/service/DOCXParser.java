package com.resume.backend.service;

import java.io.InputStream;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;

public class DOCXParser {
    public static String parse(InputStream inputStream) {
        try {
            //FileInputStream fis = new FileInputStream(path);
            XWPFDocument document = new XWPFDocument(inputStream);

            XWPFWordExtractor extractor = new XWPFWordExtractor(document);
            String text = extractor.getText();

            extractor.close();
            document.close();

            return text;

        } 
        catch(Exception e) {
            e.printStackTrace();

            return null;
        }
    }
}