<?php 
    function addItem($content,$connection){
        $id = $content->id;
        $name = $content->name;  
        $calorie = $content->calorie;

        $query = "INSERT INTO items(ID,itemName,Calorie) ";
        $query .= "VALUES ('$id','$name','$calorie')";
        $result = mysqli_query($connection , $query);
            
        if($result)
        {
            print_r("success");
        }
        else
        {
            ShowAlert(mysqli_error($connection));
        }
    }

    function getItems($connection){
        $query = "SELECT * FROM items";
        $result = mysqli_query($connection, $query);
        $items = [];

        while($row = mysqli_fetch_assoc($result)){
            $items[] = $row;
        }

        $json = json_encode($items);
        return $json;
    }

    function updateItem($content,$connection){
        $id = $content->id;
        $name = $content->name;  
        $calorie = $content->calorie;

        $query = "UPDATE items SET ";
        $query .= "itemName = '$name', ";
        $query .= "Calorie = $calorie ";
        $query .= "WHERE ID = $id ";
        $result = mysqli_query($connection , $query);
            
        if($result)
        {
            print_r("success");
        }
        else
        {
            ShowAlert(mysqli_error($connection));
        }
    }

    function deleteItem($id,$connection){
        $query = "DELETE FROM items ";
        $query .= "WHERE ID = $id ";

        $result = mysqli_query($connection,$query);
        
        if($result)
        {
            print_r("success");
        }
        else
        {
            ShowAlert(mysqli_error($connection));
        }
    }

    function deleteAll($connection){
        $query = "DELETE FROM items";

        $result = mysqli_query($connection,$query);

        if($result)
        {
            print_r("success");
        }
        else
        {
            ShowAlert(mysqli_error($connection));
        }
    }

?>