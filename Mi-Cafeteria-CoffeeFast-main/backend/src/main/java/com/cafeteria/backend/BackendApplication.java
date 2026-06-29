package com.cafeteria.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		Dotenv dotenv;
		try {
			dotenv = Dotenv.configure().load();
		} catch (Exception e) {
			dotenv = Dotenv.configure().directory("./backend").ignoreIfMissing().load();
		}
		dotenv.entries().forEach(entry -> {
			System.setProperty(entry.getKey(), entry.getValue());
		});
		SpringApplication.run(BackendApplication.class, args);
	}

}
