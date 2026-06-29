package com.cafeteria.backend.config;

import com.cafeteria.backend.model.Perfil;
import com.cafeteria.backend.repository.PerfilRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * Convierte el JWT de Supabase en un Authentication de Spring Security,
 * consultando el ROL real desde nuestra tabla Perfil (no confiamos en
 * ningún claim de rol que venga dentro del JWT, porque el frontend o
 * Supabase no lo gestionan como fuente de verdad de permisos).
 */
@Component
public class SupabaseJwtAuthConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Autowired
    private PerfilRepository perfilRepository;

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        String correo = jwt.getClaimAsString("email");

        Collection<GrantedAuthority> authorities = obtenerAuthorities(correo);

        return new JwtAuthenticationToken(jwt, authorities, correo);
    }

    private Collection<GrantedAuthority> obtenerAuthorities(String correo) {
        if (correo == null) {
            return Collections.emptyList();
        }

        Perfil perfil = perfilRepository.findByCorreoIgnoreCase(correo);

        if (perfil == null || perfil.getRol() == null) {
            // Sin perfil o sin rol asignado -> tratamos como CLIENTE por defecto
            return List.of(new SimpleGrantedAuthority("ROLE_CLIENTE"));
        }

        // hasRole('ADMIN') en Spring Security espera el prefijo "ROLE_"
        return List.of(new SimpleGrantedAuthority("ROLE_" + perfil.getRol().name()));
    }
}
