import { mailTemplateObj } from '../model/RegistrationEmail';

export default function information(mail: mailTemplateObj) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    *{margin:0;padding:0;}
    .container{
      max-width: 700px;
      margin: 0 auto;
    }
    .content{
      padding: 10px;
      margin: 10px;
      background-color: blue;
    }
    .mail-header{
      padding: 5px;
      background-color: yellow;
    }
    .mail-body{
      padding: 5px;
      background-color: gray;
    }
    .mail-footer{
      padding: 5px;
      background-color: green;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <div class="mail-header">
        <h2>INFORMATION EMAIL</h2>
        <p>Hai, ${mail.name}</p>
      </div>
      <div class="mail-body">
        <p>Ini adalah body</p>
      </div>
      <div class="mail-footer">
        <p>Ini adalah footer</p>
      </div>
    </div>
  </div>
</body>
</html>`
}