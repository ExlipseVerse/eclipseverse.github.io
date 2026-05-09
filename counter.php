<?php

$file = "counter.txt";

$count = file_exists($file) ? (int)file_get_contents($file) : 0;

$count++;

file_put_contents($file, $count);

echo json_encode([
    "views" => $count
]);

?>