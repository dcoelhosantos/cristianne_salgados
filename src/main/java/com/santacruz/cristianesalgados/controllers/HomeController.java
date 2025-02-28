package com.santacruz.cristianesalgados.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "redirect:/html/index.html"; 
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }
}