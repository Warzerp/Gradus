package com.buscador.semantico.user;

import com.buscador.semantico.exception.ApiException;
import com.buscador.semantico.user.dto.UpdateUserRequest;
import com.buscador.semantico.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Lógica de negocio de usuarios.
 * El controller solo delega aquí; nunca accede al repositorio directamente.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<UserResponse> findAllActive(Pageable pageable) {
        return userRepository.findByActivoTrue(pageable)
                .map(UserResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Usuario no encontrado con id: " + id));
        return UserResponse.fromEntity(user);
    }

    @Transactional
    public UserResponse update(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Usuario no encontrado con id: " + id));

        if (request.getNombre() != null) user.setNombre(request.getNombre());
        if (request.getEmail() != null) {
            if (userRepository.existsByEmail(request.getEmail())
                    && !request.getEmail().equalsIgnoreCase(user.getEmail())) {
                throw ApiException.conflict("El email ya está en uso: " + request.getEmail());
            }
            user.setEmail(request.getEmail());
        }
        if (request.getRol() != null) user.setRol(request.getRol());
        if (request.getActivo() != null) user.setActivo(request.getActivo());

        return UserResponse.fromEntity(userRepository.save(user));
    }

    /**
     * Baja lógica: marca el usuario como inactivo sin eliminarlo de la BD.
     */
    @Transactional
    public void deactivate(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Usuario no encontrado con id: " + id));
        user.setActivo(false);
        userRepository.save(user);
    }
}
