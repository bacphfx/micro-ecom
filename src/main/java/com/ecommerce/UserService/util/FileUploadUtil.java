package com.ecommerce.UserService.util;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

public class FileUploadUtil {
    public static void saveFile(String uploadDir, String fileName, MultipartFile file) throws IOException {
        Path projectPath = Paths.get(System.getProperty("user.dir")).toAbsolutePath();
        Path uploadPath = projectPath.resolve(uploadDir);
        if (!Files.exists(uploadPath)){
            Files.createDirectories(uploadPath);
        }
        try(InputStream inputStream = file.getInputStream()){
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e){
            throw new IOException("Could not save file: " + fileName, e);
        }
    }

    public static void cleanDir(String dir){
        Path projectPath = Paths.get(System.getProperty("user.dir")).toAbsolutePath();
        Path dirPath = projectPath.resolve(dir);
        try {
            Files.list(dirPath).forEach(file->{
                if(!Files.isDirectory(file)){
                    try {
                        Files.delete(file);
                    } catch (IOException e) {
                        System.out.println("Could not delete file: " + file);
                    }
                }
            });
        } catch (IOException e){
            System.out.println("Could not list directory: " + dirPath);
        }
    }
}
