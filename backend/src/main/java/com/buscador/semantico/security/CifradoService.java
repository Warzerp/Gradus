package com.buscador.semantico.security;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Cifrado AES-256-GCM autenticado para contenido de trabajos privados.
 * Formato del ciphertext: Base64(iv[12] + tag[16] + ciphertext)
 */
@Slf4j
@Service
public class CifradoService {

    private static final String ALGORITMO   = "AES/GCM/NoPadding";
    private static final int IV_LENGTH      = 12;
    private static final int TAG_BITS       = 128;

    @Value("${app.cifrado.clave-base64:}")
    private String claveBase64;

    private SecretKey secretKey;

    @PostConstruct
    void init() {
        if (claveBase64 == null || claveBase64.isBlank()) {
            log.warn("app.cifrado.clave-base64 no configurada; cifrado deshabilitado");
            return;
        }
        byte[] keyBytes = Base64.getDecoder().decode(claveBase64);
        if (keyBytes.length != 32) {
            throw new IllegalStateException("La clave AES debe ser de 256 bits (32 bytes en Base64)");
        }
        secretKey = new SecretKeySpec(keyBytes, "AES");
        log.info("CifradoService inicializado con AES-256-GCM");
    }

    public boolean isHabilitado() {
        return secretKey != null;
    }

    public String cifrar(String textoPlano) {
        if (!isHabilitado()) throw new IllegalStateException("Cifrado no configurado");
        try {
            byte[] iv = new byte[IV_LENGTH];
            new SecureRandom().nextBytes(iv);

            Cipher cipher = Cipher.getInstance(ALGORITMO);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, new GCMParameterSpec(TAG_BITS, iv));
            byte[] ciphertext = cipher.doFinal(textoPlano.getBytes());

            byte[] resultado = new byte[IV_LENGTH + ciphertext.length];
            System.arraycopy(iv, 0, resultado, 0, IV_LENGTH);
            System.arraycopy(ciphertext, 0, resultado, IV_LENGTH, ciphertext.length);

            return Base64.getEncoder().encodeToString(resultado);
        } catch (Exception e) {
            throw new RuntimeException("Error cifrando contenido: " + e.getMessage(), e);
        }
    }

    public String descifrar(String textoCifradoBase64) {
        if (!isHabilitado()) throw new IllegalStateException("Cifrado no configurado");
        try {
            byte[] datos = Base64.getDecoder().decode(textoCifradoBase64);
            byte[] iv = new byte[IV_LENGTH];
            System.arraycopy(datos, 0, iv, 0, IV_LENGTH);
            byte[] ciphertext = new byte[datos.length - IV_LENGTH];
            System.arraycopy(datos, IV_LENGTH, ciphertext, 0, ciphertext.length);

            Cipher cipher = Cipher.getInstance(ALGORITMO);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, new GCMParameterSpec(TAG_BITS, iv));
            return new String(cipher.doFinal(ciphertext));
        } catch (Exception e) {
            throw new RuntimeException("Error descifrando contenido: " + e.getMessage(), e);
        }
    }
}
