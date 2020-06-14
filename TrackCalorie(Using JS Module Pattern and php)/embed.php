<?php 
        include "functions.php";
        include "db.php";

        $task = $_POST["task"];

        function ShowAlert($errInfo)
        {
                echo json_encode($errInfo);
        }
        
        if($connection)
        {
                
                switch($task){
                        case "addItem" :
                                $content = json_decode($_POST["content"]);
                                addItem($content,$connection);
                                break;
                        case "getItems" :
                                echo getItems($connection);
                                break;
                        case "updateItem" :
                                $content = json_decode($_POST["content"]);
                                updateItem($content,$connection);
                                break;
                        case "deleteItem" :
                                $id = $_POST["ID"];
                                deleteItem($id,$connection);
                                break;
                        case "deleteAll" :
                                deleteAll($connection);
                                break;
                }
        }
        else
        {
                ShowAlert(mysqli_connect_error());
        }

?>