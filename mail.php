<?php

$recepient = "rabdyrka@gmail.com";
$sitename = "FrontLabor";

$name = trim($_POST["name"]);
$surname = trim($_POST["surname"]);
$text = trim($_POST["text"]);
$selecth = trim($_POST["selecth"]);
$message = "Имя: $name \nФамилия: $surname\nТекст: $text \nСписок: $selecth";

$pagetitle = "Новая заявка с сайта \"$sitename\"";
mail($recepient, $pagetitle, $message, "Content-type: text/plain; charset=\"utf-8\"\n From: $recepient");