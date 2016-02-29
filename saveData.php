<?php

  $file_title = "data.txt";

  //faili sisu
  $entries_from_file = file_get_contents($file_title);

  //string objektideks
  $entries = json_decode($entries_from_file);
  //var_dump($entries);
  //[{"title":"martti"}]

  //?title=nimi&ingredients=koostis
  if(isSet($_GET["title"]) && isSet($_GET["ingredients"])){
    //ei ole tühjad
    if(!empty($_GET["title"]) && !empty($_GET["ingredients"])){

      //lihtne objekt
      $object = new StdClass();
      $object->title = $_GET["title"];
      $object->ingredients = $_GET["ingredients"];

      //lisan objekti massiivi
      array_push($entries, $object);

      //teen stringiks
      $json_string = json_encode($entries);

      //salvestan faili üle, salvestan massiivi stringi kujul
      file_put_contents($file_title, $json_string);
    }
  }

  //trükin välja stringi kujul massiivi (võib-olla lisas midagi juurde)
  echo(json_encode($entries));

?>
