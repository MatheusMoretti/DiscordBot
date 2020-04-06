const Discord = require('discord.js');      //Carregando a dependencia
const config  = require('./config.json');    //Fazendo o login do requerimento do token
const client  = new Discord.Client();        //Conectando ao cliente

//Configuração de eventos
client.on('ready', () => {
  console.log(`${client.user.username} pronto para servir`);

  let s = [
    {name: `Servent`, type: 'STREAMING', url:'https://www.twitch.tv/woodszin'},
    {name: `Servent`, type: 'STREAMING', url:'https://www.twitch.tv/yoda'},
    {name: `Desenvolvido por TheBestPixel4e`, type: 'STREAMING', url:'https://www.twitch.tv/thomezord'}
  ];  //vetor de opçoes

  function st(){
    let rs = s[Math.floor(Math.random()*s.length)];
    client.user.setPresence({activity:rs});
  } //funçao que escolhe a opçao de forma random, e da set na presence

  st();
  setInterval( () => st(), 10000);  //apos x ms ele roda a função st para mudar o que o bot esta fazendo

});

//Quando o usuario entra no servidor
client.on('guildMemberAdd', member => {
  message.chanel.send("Precisa ser reparado");
  member.guild.channels.get("695971331866492928").send(member.user.username + " Seja bem vindo ao Servidor"); //mensagem no canal de texto boas_vindas
  member.send(member.user.username + " Você agora esta concetado no servidor " + guild.username)//mensagem privada
});

//Quando a pessoa sai do servidor
//precisa arrumar
client.on('guildMemberRemove', async member => {
  client.channels.get()
  message.chanel.send("Precisa ser reparado");
  member.guild.channels.get("695971331866492928").send(member.user.username + " Saiu do Servidor"); //mensagem no canal de texto boas_vindas
  member.send(member.user.username + " Você não esta mais concetado ao servidor " + guild.username)//mensagem privada
});

//Evento mensagem CORE DO BOT

client.on("message", async message => {

  if(message.author.bot)return;                           //impedir que receba mensagem de outros bots
  if(message.author.type === "dm") return;                //impedir mensagem de dm
  if(!message.content.startsWith(config.prefix)) return;  //impedir que uma mensagem sem prefixo entre aqui

//separação da mensagem enviada pelo usuario em argumentos
//Exemplo !mudarnick jorge -> !mudarnick = args[0] e jorge = args[1] mas com o args.shift ele desconsidera o commando como um args
const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
const cmd = args.shift().toLowerCase();
let embed = new Discord.MessageEmbed();

switch(cmd){
  //-----------------------------------------------------
  //Pegar o PING
  case "ping":
    const cmd = await message.channel.send("Ping?");
    cmd.edit(`Pong!`);
    embed.setColor('#0099ff')
    .setTitle("Ping")
    .addFields(
      {name:`Pong! A Latencia é` ,value: `${Math.floor(cmd.createdAt - message.createdAt)}ms.`}
    )
    //message.channel.send(e
  break;

  //-----------------------------------------------------
  //Dados do Servidor
  case "server":
    embed.setTitle("Dados do servidor")
    .setColor('#FF00DC')
    .addFields(
      {name:`Nome do servidor: ${message.guild.name}\nTotal de membros:, ${message.guild.memberCount}\n`, value:`Dono do servidor:${message.guild.owner.displayName}`}
    )
    .setTimestamp();
  //tentar colocar o icone
  break;

  //-----------------------------------------------------
  //Informações do Usuario
  case "userinfo":
    embed.setTitle("Informações do Usuario")
    .setColor('#FF002E')
    .addFields(
      {name:`Seu username: ${message.author.username}\nSeu ID: ${message.author.id}`, value:`Sua tag: ${message.author.tag}`}
    )
  break;

  //-----------------------------------------------------
  //Help
  case "help":
    embed.setTitle("Help")
    .setColor('#F7FF03');

    if(args[0] === "roll"){
      embed.addFields(
        {name:"Os argumentos do roll devem ser 2 ou 3, da seguinte forma:", value:"!roll A B C"},
        {name:"Sendo", value:"A- O numero de dados que quer jogar\nB- qual o dado que quer jogar\nC- caso tenha algum adicional"}
      );
    }else{
      embed.addFields(
        {name:"Esses codigos",value:"eu posso executar:"},
        {name:"!help ",value:"Apresenta os comandos"},
        {name:"!server ",value:"Apresenta dados do servidor"},
        {name:"!userinfo ",value:"Apresente seus dados como usuário"},
        {name:"!roll ",value:"Utilize o comando !help roll"},
        {name:"Outros virão",value:"Aguarde..."}
      );
    }

  break;

  case "roll":
    embed.setTitle("Rolagem de Dados")
    .setColor('#02A51F');
    let vezes = parseInt(args[0],10);
    let dado  = parseInt(args[1],10);
    let add = 0;
    let res = 0;

    if(args[2] != undefined){
      add   = parseInt(args[2],10);
    }

    while(vezes>0){

      res = ((Math.round(Math.random() * dado))+1);
      if(res > dado)res--;

      embed.addFields({name:"Rolagem",value:res});

        if(add != 0){
          if((res+add) > dado){
            embed.addFields({name:"Rolagem: ",value:dado});
          }else if((res+add) <= 1){
            embed.addFields({name:"Rolagem: ",value:"1"});  
          }else{
            embed.addFields({name:"Rolagem: ",value:res+add}); //random number betwhe  
          }
        }

      vezes = vezes - 1;
    }
    /*para gerar um numero randomico usar Math.random() ai par aum numero entre 1 e 10 é so *10
      para arredondarpara baixo console.log(Math.floor(Math.random() * 10)) -FLOOR
      para cima console.log(Math.ceil(Math.random() * 10))  -CEIL
      para o mais proximo console.log(Math.round(Math.random() * 10)) -ROUND
    */
  break;
}

  message.channel.send(embed);
});

//Inicialização propriamente dita do BOT
//pegar o token
client.login(config.token);