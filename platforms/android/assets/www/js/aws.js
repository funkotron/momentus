/**
 * Created by adam on 27/06/15.
 */

function prn(tex) {
    var div = document.getElementById('maintex');
    div.innerHTML = div.innerHTML + "\n" + tex;
}

function upload_file(file, signed_request, url){
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", signed_request);
    xhr.setRequestHeader('x-amz-acl', 'public-read');
    xhr.onload = function() {
        if (xhr.status === 200) {
            document.getElementById("preview").src = url;
            document.getElementById("avatar_url").value = url;
        }
    };
    xhr.onerror = function() {
        alert("Could not upload file.");
    };
    xhr.send(file);
}


function aws_get_signed_request(file){
    //window.aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
    var s3 = new window.aws.S3();
    var fileName = file.substr(file.lastIndexOf('/') + 1);
    var s3_params = {
        Bucket: "mohunt",
        Key: fileName,
        Expires: 1000,
        ContentType: "image/jpeg",
        ACL: 'public-read'
    };

    window.aws.s3.getSignedUrl('putObject', s3_params, function(err, data){
        if(err){
            console.log(err);
        }
        else{
            upload_file(file, data, 'https://mohunt.s3.amazonaws.com/'+fileName);
            prn("Upload successful");
        }
    });
}

//
//function aws_get_signed_request(file){
//    var xhr = new XMLHttpRequest();
//    xhr.open("GET", "/sign_s3?file_name="+file.name+"&file_type="+file.type);
//    xhr.onreadystatechange = function(){
//        if(xhr.readyState === 4){
//            if(xhr.status === 200){
//                var response = JSON.parse(xhr.responseText);
//                upload_file(file, response.signed_request, response.url);
//            }
//            else{
//                alert("Could not get signed URL.");
//            }
//        }
//    };
//    xhr.send();
}