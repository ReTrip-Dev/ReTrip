package com.example.demo.controller;

import com.example.demo.dto.TravelAnalysisResponseDto;
import com.example.demo.service.RetripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UploadController {

    private final RetripService retripService;

    @PostMapping(value = "/uploads", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<ResponseEntity<TravelAnalysisResponseDto>> uploadMultipleImages(
            @RequestPart("images") Flux<FilePart> images, ServerHttpRequest request) {
        MediaType contentType = request.getHeaders().getContentType();
        log.info("Content-Type: {}", contentType);
        if (contentType == null || !MediaType.MULTIPART_FORM_DATA.isCompatibleWith(contentType)) {
            log.error("Unsupported Content-Type: {}", contentType);
            return Mono.just(ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                    .body(null));
        }
        return retripService.createRetripFromImages(images)
                .map(result -> {
                    log.info("여행 분석 완료: retripId={}", result.getRetripId());
                    return ResponseEntity.ok(result);
                })
                .onErrorResume(ex -> {
                    log.error("여행 분석 처리 중 오류 발생", ex);
                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null));
                });
    }
}