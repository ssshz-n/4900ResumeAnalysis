package com.resume.backend.service;

import java.io.InputStream;
import java.io.IOException;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

public class PDFParser {
    public static String parse(InputStream inputStream) {
        try {
            //File file = new File(path);

            PDDocument document = PDDocument.load(inputStream);
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            document.close();

            return text;
        } 
        catch(IOException e) {
            e.printStackTrace();

            return null;
        }
    }
}