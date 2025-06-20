package com.ecommerce.project.service;

import com.ecommerce.project.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor          // Lombok, or add an explicit ctor
public class FileServiceImpl implements FileService {

    @Value("${uploadImage}")       // ← picks up images/
    private String uploadDir;

    @Override
    public String uploadImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }

        String original = file.getOriginalFilename();
        if (original == null || !original.contains(".")) {
            throw new IllegalArgumentException("Invalid file name");
        }

        String fileName = UUID.randomUUID()
                + original.substring(original.lastIndexOf('.'));
        String fullPath = uploadDir + File.separator + fileName;

        File folder = new File(uploadDir);
        if (!folder.exists()) {
            // mkdirs() in case you use nested paths like /opt/data/images
            boolean created = folder.mkdirs();
            if (!created) {
                throw new IOException("Failed to create upload directory: " + uploadDir);
            }
        }

        Files.copy(file.getInputStream(), Paths.get(fullPath),
                StandardCopyOption.REPLACE_EXISTING);   // overwrite if exists
        return fileName;
    }
}
