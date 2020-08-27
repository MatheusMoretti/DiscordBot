const Discord = require('discord.js');      //Carregando a dependencia
const config  = require('./config.json');    //Fazendo o login do requerimento do token
const client  = new Discord.Client();        //Conectando ao cliente
const mysql = require("mysql");

//-----------------------------------------------------IDEIAS
//musica e ja algumas pre selecionadas para colocar durante as partidas de rpg
//erros: quantidade de argumento; acesso ao banco (mestre,campanha,inventario)

//#region Conexoes e Guild auto commands

//-----------------------------------------------------BD CONNECETION
//#region BD connection
//Creating a conection for the data base
var conRPG = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"***",
  database:"discordbot" //aqui altera a database que esta usando acho que da pra criar mais de uma coneção
});

//#endregion BD connection

//-----------------------------------------------------WHEN CONNECTED WITH DATA-BASE
//#region BD connection message
//when the data base is first connected
conRPG.connect(err => {
  if(err) throw err;
  console.log("connect to database RPG!");
});
//#endregion BD connection message

//-----------------------------------------------------READY
//#region READY
//Configuração de eventos READY
client.on('ready', () => {
  console.log(`${client.user.username} pronto para servir`);

  let s = [
    {name: `Servent`, type: 'WATCHING', url:'https://www.twitch.tv/woodszin'},
    {name: `Servent`, type: 'WATCHING', url:'https://www.twitch.tv/yoda'},
    {name: `Desenvolvido por TheBestPixel4e`, type: 'WATCHING', url:'https://www.twitch.tv/thomezord'},
    {name: `Servent`, type:'WATCHING',url:'https://www.twitch.tv/lhamalive'}
  ];  //vetor de opçoes

  function st(){
    let rs = s[Math.floor(Math.random()*s.length)];
    client.user.setPresence({activity:rs});
  } //funçao que escolhe a opçao de forma random, e da set na presence

  st();
  setInterval( () => st(), 10000);  //apos x ms ele roda a função st para mudar o que o bot esta fazendo

});
//#endregion READY

//-----------------------------------------------------GUILD MEMEBER ADD
//#region GUILD MEMEBER ADD
//Quando o usuario entra no servidor  
client.on('guildMemberAdd', async member => {
  
  const guild = client.guilds.cache.get("695439460170596425");
  var memberCount = guild.members.cache.filter(member => !member.user.bot).size;

  let canal = client.channels.cache.get('709559164568862781');

  if(canal){

  let embed = new Discord.MessageEmbed();

  embed.setTitle(`Welcome`);

  switch(Math.round(Math.random()*5)){
  case 1: embed.setDescription(`Opa ${member} seja bem vindo ao nosso servidor.\n\nAgora estamos com ${memberCount} membros no servidor`); break;
  case 2: embed.setDescription(`Salve ${member}, quanta nobreza e altivez, bem vindo.\n\nAgora estamos com ${memberCount} membros no servidor`);break;
  case 3: embed.setDescription(`${member} seja bem vindo. Divirta-se.\n\nEstamos com ${memberCount} membros no servidor`);break;
  case 4: embed.setDescription(`Bem Vindo ${member} ao inicio da sua jornada.\n\nAgora estamos com ${memberCount} membros no servidor`);break;
  case 5: embed.setDescription(`${member} não esqueça de levar seu d20 para a batalha.\n\nAgora estamos com ${memberCount} membros no servidor`);break;
  }
  embed.setColor('GREEN');
  canal.send(embed);
  }
});
//#endregion GUILD MEMEBER ADD

//-----------------------------------------------------GUILD MEMBER REMOVE
//#region GUILD MEMBER REMOVE
//Quando alguem sai do servidor
client.on('guildMemberRemove', async member => {

  const guild = client.guilds.cache.get("695439460170596425");
  var memberCount = guild.members.cache.filter(member => !member.user.bot).size;

  let canal = client.channels.cache.get('709566667444715530');

  if(canal){

  let embed = new Discord.MessageEmbed();
  embed.setTitle(`Nos abandonaram`);
  switch(Math.round(Math.random()*5)){
    case 1: embed.setDescription(`${member} abanou o servidor.\n\nAgora estamos com ${memberCount} membros no servidor`); break;
    case 2: embed.setDescription(`Nosso companheiro de batalha ${member} não esta mais entre nós.\n\nAgora estamos com ${memberCount} membros no servidor`);;break;
    case 3: embed.setDescription(`${member} se foi, mas se foi com honra.\n\nEstamos com ${memberCount} membros no servidor`);break;
    case 4: embed.setDescription(`Um brinde aqueles que se foram para que hoje pudessemos beber, vá em paz ${member}.\n\nAgora estamos com ${memberCount} membros no servidor`);break;
    case 5: embed.setDescription(`${member} não esqueceremos de você, musicas serão entoadas para ti.\n\nAgora estamos com ${memberCount} membros no servidor`);break;
    }
  embed.setColor('RED');
  canal.send(embed);
  }
});
//#endregion GUILD MEMBER REMOVE

//-----------------------------------------------------GUILD DELETE
//#region GUILD DELETE
//Quando o bot eh retirado de um servidor
client.on('guildDelete', guild =>{
  console.log(`${client.user.username} saiu do servidor: ${guild.name}`);
});
//#endregion GUILD DELETE

//-----------------------------------------------------GUILD CREATE
//#region GUILD CREATE
//Quando o bot eh adicionado a um servidor
client.on('guildCreate', guild =>{
  console.log(`${client.user.username} entrou no servidor: ${guild.name}`);
  });
//#endregion GUILD CREATE

//#endregion Conexoes e Guild auto commands

//-----------------------------------------------------MESSAGE
//#region Messages
//Evento mensagem CORE DO BOT

client.on("message", async message => {


//#region init  

if(message.author.bot)return;      //impedir que receba mensagem de outros bots                     
if(message.author.type === "dm") return;   //impedir mensagem de dm             

//-----------------------------------------------------
if(!message.content.startsWith(config.prefix)) return;  //impedir que uma mensagem sem prefixo entre aqui
  
const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
const cmd = args.shift().toLowerCase(); //pega o conteudo 0 de args e joga para cmd, e realoca os outros argumentos partindo do arg 0
let embed = new Discord.MessageEmbed();//cria um nova mensagem embed
let x = new Date();//cria uma nova variavel do tipo Date(), para pegar dia,mees,ano,horarios, etc.
let who ,sql , i ,j ,k;

//#endregion init

//#region Funçoes
//Fazer depois uma tabela de erros e tentar modularizar
function error(comando){
  console.log(`Erro no comando ${comando}`);
}
function queryerr(num){
  //esse numero refere-se ao nivel de acesso ao BD
  console.log("NIVEL DE ACESSO: "+num);
}

//
function chekarg(){ //isso eu vou usar em tudo que eh referente a referenciar alguem com @
  let vetor = args[1];
  if(vetor[1]==='@'){
    return true
  }
  return false;
}

//
function getid(){
  let personid = args[1];
  personid = args[1];
  args[1] = personid.substring(3,(personid.length-1));
  personid = args[1];
  return personid;
}

//criar uma funcao que recebe um vetor de caracter e separe o que esta separado por virgula e retorne um vetor onde cada possicao eh uma string
function separateCOMA(vetbase){

  //Pega os itens enviados por args[2] agora em vb e separa num vetor auxiliar      
  let conteudoaux = [0,0,0,0,0,0,0,0,0,0];
  let conteudo = vetbase;
  let i = i1 = i2 = 0;
  let cont=0;

  for(i=0;i<conteudo.length;i++){
    if(conteudo[i] === ','){
      conteudoaux[i1]= conteudo.substring(i2,i); //salva o campo que deseja alterar no vet aux
      i1++; //proxima possicao do vetor auxilar          
      i2=(i+1); //k precisa ser a possicao depois da virgula           
    }else if(i===(conteudo.length-1)){  //pq a ultima palavra nao acaba em virgula e se chegou ate o fim nao rolou problema entao salva a ultima palavra
      conteudoaux[i1]= conteudo.substring(i2,(i+1));         
    }
  }
  conteudo = conteudoaux;
  
  i=0;
  do{
    cont++;
    i++;
  }while(conteudo[i]!=0);
  if(cont<=conteudo.length){
    conteudo.length = cont;
  }

  return conteudo;
}

//
function verifqtdd(v,lim){
  if(v.length > lim) return true;
  else return false;
}

//#endregion Funçoes

switch(cmd){    //Switch para verificação de qual comando foi executado

//#region not rpg
//-----------------------------------------------------PING
//#region ping
  case "ping":
  const cmd = await message.channel.send("Ping?");
  cmd.edit(`Pong!`);
  embed.setColor('#0099ff')
  .setTitle("Ping")
  .addFields(
    {name:`Pong! A Latencia é` ,value: `${Math.floor(cmd.createdAt - message.createdAt)}ms.`}
  );
    break;
//#endregion ping

//-----------------------------------------------------SERVER
//#region server Dados do Servidor
  case "server":

  embed.setTitle("Dados do servidor")
  .setColor('#FF00DC')
  .addFields(
  {name:`Nome do servidor: ${message.guild.name}\nTotal de membros: ${message.guild.memberCount}\n`, value:`Dono do servidor:${message.guild.owner.displayName}`}
  )
  .setThumbnail(message.guild.iconURL());
    //tentar colocar o icone 
  break;
//#endregion server 

//-----------------------------------------------------USERINFO
//#region userinfo Informações do Usuario
case "userinfo":
  embed.setTitle("Informações do Usuario")
  .setColor('#FF002E')
  .addFields(
  {name:"Seu username: ",value:message.author.username},
  {name:"Seu ID: ",value:message.author.id},
  {name:"Sua Tag: ",value:message.author.tag}  
  )
  .setThumbnail(message.author.avatarURL()); 
  break;
//#endregion userinfo   

//-----------------------------------------------------DAY
//#region day Dia da semana
case "day":
  let days = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
  let months = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

  embed.setTitle("Dia da semana")
  .setColor('#79DBFF')
  .addFields(
  {name:"Hoje é dia: ",value:`${days[x.getDay()]}`},
  {name:"Do mês: ", value:`${months[x.getMonth()]}`},
  {name:"Data completa: ",value: x.getDate()+'/'+(x.getMonth()+1)+'/'+x.getFullYear()}
  ); 
  break;
//#endregion day

//-----------------------------------------------------TIME
//#region time Horario atual
case "time":
  embed.setTitle("Dia da semana")
  .setColor('#79FF7B')
  .addFields(
  {name:"Agora são exatamente: ",value: x.getHours() + ':' + x.getMinutes()}
  ); 
break;
//#endregion time

//-----------------------------------------------------COMMANDS
//#region commands
//Apresenta os comandos possiveis
case "commands":
    embed.setTitle("Comandos")
    .setColor('#26AB34');

    if(args[0] === "roll"){
      embed.addFields(
        {name:"Os argumentos do roll devem ser 2, 3 ou 4, da seguinte forma:", value:"!roll A B C D"},
        {name:"ou",value:"!roll A B D"},
        {name:"ATENÇÃO",value:"! D - tem que ser obrigatoriamente um s (minúsculo) !"},
        {name:"Sendo", value:"A- O numero de dados que quer jogar\nB- Numero de faces do dado quer jogar\nC- Número adicional caso exista\nD- Para ver qual foi o numero aleatorio base gerado"}
      );
    }else if(args[0] === "rpg"){
      embed.addFields(
        {name:"!rpg createpersonagem -nome desejado-",value:"Cria um personagem vinculado ao seu ID (max de 1 por ID)"},
        {name:"!rpg player -@jogador-",value:"Mostra quais sao as informaçoes do jogador"},
        {name:"!rpg attpersonagem -campos- -informaçoes dos campos-",value:"Atualiza as informaçoes do seu personagem, exceto xp e gold"},
        {name:"!rpg deletepersonagem",value:"Delete o personagem vinculado ao seu ID"},
        {name:"!rpg createcampain -nome desejado-",value:"Cria uma campanha tendo você como mestre da campanha"},
        {name:"!rpg campain -nome do mestre ou jogador-",value:"Retorna os dados da campanha vinculado ao mestre ou jogador escolhido"},
        {name:"!rpg altercampname -novo nome-",value:"Altera o nome da campanha que você mestra"},
        {name:"!rpg deletecamp",value:"Apaga a campanha vinculada a você"},
        {name:"!rpg addplayer -@player-",value:"Adiciona um jogador a sua campanha"},
        {name:"!rpg exitcampain",value:"Retira você da campanha que esta vinculado"},
        {name:"!rpg additem -@player- -itens- -quantidades-",value:"Adiciona a um jogador de sua campanha uma lista de item e suas quantidades (max 5)"},
        {name:"!rpg invent -@player-",value:"Mostra os itens do inventario de alguem"},
        {name:"!rpg remitem -@player- -itens-",value:"Apaga itens de um jogador de sua campanha"},
        {name:"!rpg add (gold/xp) -quantidade- -@player-",value:"Adiciona a um jogador uma quantidade de xp ou gold"},
        {name:"",value:""}
      );
    }else{
      embed.addFields(
        {name:"Esses codigos",value:"posso executar:"},
        {name:"!commands ",value:"Apresenta os comandos"},
        {name:"!server ",value:"Apresenta dados do servidor"},
        {name:"!userinfo ",value:"Apresente seus dados como usuário"},
        {name:"!day",value:"Apresenta o data de Hoje"},
        {name:"!time",value:"Apresenta o horário atual"},
        {name:"!roll ",value:"Utilize o comando !commands roll para mais detalhes"},
        {name:"!rpg ",value:"Utilize o comando !commands rpg para mais detalhes"},
        {name:"Outros virão",value:"Aguarde..."}
      );
    } 
break;
//#endregion commands

//-----------------------------------------------------HELP
//#region help
//Informa o que é o servidor e o que ele pode fazer fora os comandos
case "help":
  embed.setTitle("Help")
  .setColor('#26AB34')
  .addFields(
    {name:"Pra que serve o servidor? ",value:"Serve como um ambiente para jogar RPG e servir como comandos gerais, como horas, data, ping, etc"},
    {name:"O bot ",value:"Informa quando alguem entra ou sai do servidor"},
    {name:"O bot ",value:"Pode funcionar como rolador de dados"},
    {name:"Espero que ",value:"se divirtam"},
    {name:"Juntem seus amigos ",value:"e crirem sua proxima aventura de RPG"}
  );
break;
//#endregion help
//#endregion not rpg

//-----------------------------------------------------ROLL
//#region roll
//Rolagem de dados
case "roll":
  embed.setTitle("Rolagem de Dados")
  .setColor('#02A51F');

  let vezes = parseInt(args[0],10); 
  
  let dado  = parseInt(args[1],10);
  
  let add = 0; // args[2]
  
  let res = 0;

  let soma = 0;

  if(args[2] != undefined && args[2] != 's'){
    add   = parseInt(args[2],10);
  }
  
    for(let i=0;i<vezes;i++){
      res = ((Math.round(Math.random() * dado))); //
      if(res!=dado){
        res+=1;
      }
      res+=add;
      soma+=res;
      embed .addFields({name:"Rolagem "+(i+1),value:(res-add)+" bonus "+add+" -> "+res});
      res=0;
    }
    embed.addFields({name:"Somatario:",value:soma});

    /*para gerar um numero randomico usar Math.random() ai par aum numero entre 1 e 10 é so *10
      para arredondarpara baixo Math.floor(Math.random() * 10) -FLOOR
      para cima console.log(Math.ceil(Math.random() * 10))  -CEIL
      para o mais proximo console.log(Math.round(Math.random() * 10)) -ROUND
    */ 
break;
//#endregion roll

//-----------------------------------------------------RPG
//#region rpg
case "rpg":
switch(args[0]){

//-----------------------------------------------------PLAYER  (OK)
//#region Player 
//--------------------------Creating PERSONAGEM (OK)
//#region Creating personagem (charcreate)
//!rpg charcreate 'nome do personagem'
case "charcreate":
  if(args.length > 2){
  error(args[0]);
  return;
  } 

/*
Comando ao banco de dados para selecionar todas as linhas da tabela campanha onde o id do mestre seja igual ao id de quem mandou a mensagem,
isso é necessario pois eu nao quero que mestres de campanhas criem personagem para salvar no banco (IDEIA FUTURA CRIAR UMA TABELA PARA NPC's),
caso quem mandou a mensagem nao seja mestre ele pode criar um personagem, entao outro comando ao banco de dados é realizado para ver se quem mandou
a mensagem ja nao possui um personagem criado, caso nao tenha entao é criado um novo personagem com o nome enviado pelo comando principal
*/ 

  //Verifica se quem mandou a mensagem eh mestre de alguma camapanha   
  conRPG.query(`SELECT * FROM campanha WHERE mestreid = '${message.author.id}'`, (err,rows) =>{  
  if(err){
    error(args[0]);
    queryerr(1);
    return;
  }
  //Caso quem mandou a mensagem nao seja mestre de nenhuma campanha
  if(rows.length < 1){ 

    //Verifica se quem mandou a mensagem ja possui um personagem criado
    conRPG.query(`SELECT * FROM personagem WHERE id = '${message.author.id}'`, (err,rows)=>{  
    if(err){
      error(args[0]);
      queryerr(2);
      return;
    }
    who = args[1];
    
    //Se quem mandou a mensagem nao possui um personagem 
    if(rows.length < 1){  
      sql = `INSERT INTO personagem (id,nome) VALUES ('${message.author.id}','${who}')`;
      embed.setTitle("Personagem criado com sucesso")
      .setColor('GREEN');
      conRPG.query(sql);

    //Caso quem mandou a mensagem ja tenha um personagem
    }else{  
      embed.setTitle("ID ja cadastrado")
      .setColor('#FF0000')
      .addFields({name:"Você nao pode criar outro personagem",value:"Você ja possui um personagem vinculado ao seu ID"});
    }
    message.channel.send(embed);
    });

  //Caso quem mandou a mensagem ja seja mestre de alguma campanha
  }else{ 
    embed.setTitle("Mestres não podem ter um personagem próprio")
    .setColor('#FF0000');
    message.channel.send(embed);
  }
  });
    
break;
//#endregion Creating personagem
    
//--------------------------Apresentando dados JOGADOR (OK)
//#region player info
//!rpg charinfo player_name 
//apresenta o todos os dados do personagem de um jogador
case "charinfo":
  
  if(args.length > 2){
    error(args[0]);
    return;
  }
  if(args[1] != undefined){
    who = getid();
  }else{
    who = message.author.id;
  }
  
/*
Comando ao banco de dados para selecionar todas as linhas da tabela personagem onde o id do player seja igual ao id refenciado na mensagem,
caso o player referenciado nao tenha um personagem, é enviado uma mensagem falando que nao existe personagem da pessoam caso exista eh apresentado
todos os dados referencte a ele e quail campanha ele esta vinculado. 
*/ 

  //Verifica se o player escolhido possui um personagem
  conRPG.query(`SELECT * FROM personagem WHERE id = '${who}'`, (err,rows) => { 
  if(err){
    error(args[0]);
    queryerr(1);
    return;
  }  
  //Caso o player escolhido nao tenha um personagem
  if(rows.length < 1){  
    embed.setTitle("Esse jogador nao possui um personagem cadastrado")
    .setColor('#FF0000');
    message.channel.send(embed); 
      return;
    }else{  //caso tenha um personagem
      embed.setTitle("Dados do jogador")
      .setColor('GREEN')
      .addFields(
      {name:"Jogador: ",value:`${client.users.cache.get(who).username}`},
      {name:"Personagem: ", value:rows[0].nome},
      {name:"Classe: ", value:rows[0].classe },
      {name:"Raça: ", value:rows[0].raca },
      {name:"Alinhamento: ", value:rows[0].alinhamento }, // lg ng cg; ln tn cn; le ne ce;
      {name:"Vida: ", value:rows[0].vida },
      {name:"Força: ", value:rows[0].forca },
      {name:"Destreza: ", value:rows[0].destreza },
      {name:"Constituição: ", value:rows[0].constituicao },
      {name:"Inteligência: ", value:rows[0].inteligencia },
      {name:"Sabedoria: ", value:rows[0].sabedoria },
      {name:"Carisma: ", value:rows[0].carisma }
      );
    }
        
    //Verifica se o jogador participa de alguma campanha
    conRPG.query(`SELECT * FROM campanha WHERE playerid = '${who}'`, (err,rows) =>{
      if(err){
        error(args[0]);
        queryerr(2);
        return;
      }
        if(rows.length < 1){
          let embed2 = new Discord.MessageEmbed();
          embed2.setTitle("O jogador nao participa de nenhuma campanha")
          .setColor('#FF0000');
          message.channel.send(embed2); 
        }else{
          embed.addField(
          {name:"Participa da campanha: ",value:rows[0].nome});  
        }
    });
    message.channel.send(embed);
  });  
break;
//#endregion player info

//--------------------------Atualizando PERSONAGEM (OK)
//#region AttPersongem
//!RPG attpersonagem 'qual campo'(pode ser x,y,z) 'nova info do campo'

/*Caso o numero de argumentos seja maior que 3 ele retorna um erro, depois é feito uma verficação caso um dos campos da mensagem tenha sido gold ou xp
nao sao aceitos, pois apenas mestres de campanhas podem alterar esses valores atraves do comando add, entao cada campo digitado eh separado dentro de um
vetor auxiliar para facilitar a programacao, e o mesmo ocorre com os valores escolhidos para esses campos, e o comprimento desses vetores nao pode ser diferentes
depois verifica se a pessoa possui um personagem caso nao tenha ele volta, caso tenha, ele vai fazer a atualizacao dos campos e caso o campo seja alinhamento
existem valores fixos desse espaço portanto ha uma verificação para isso, caso seja um valor numerico a ser colocado a informaçao sofre um parseInt e entao atualiza*/ 

case "charatt":
  if(args.length > 3){
    error(args[0]);
    return;
  }

  let onde = separateCOMA(args[1]);
  let infor = separateCOMA(args[2]);

  for(i=0;i<onde.length;i++){ //verificação se existe a palavra gold ou xp
    if(onde[i] === 'xp' || onde [i] === 'gold'){
      error(args[0]);
      return;
    }
  }

//Veridicação se o lenght de onde != infor deve sair pois a quantidades de dados nao é condizente
if(infor.length != onde.length){
  error(args[0]);
  return;
}   

conRPG.query(`SELECT * FROM personagem WHERE id = '${message.author.id}'`, (err,rows) => {
  if(err){
    error(args[0]);
    queryerr(1);
    return;
  }
  if(rows.length<1){  //caso o player nao tenha um personagem
    embed.setTitle("Você não possui um personagem")
    .setColor('#FF0000');
    message.channel.send(embed);
    return;
  }
  let sql;

  for(i=0;i<onde.length;i++){
    let datainuse;
    if(onde[i] != "nome" && onde[i] != 'classe' && onde[i] != 'raca' && onde[i] != 'alinhamento'){
        datainuse = parseInt(infor[i],10);
        sql = `UPDATE personagem SET ${onde[i]} = ${datainuse} WHERE id = '${message.author.id}'`;
    }else{
      datainuse = infor[i];
      if(onde[i]==='alinhamento'){
        if(datainuse != 'lg' && datainuse != 'ng' && datainuse != 'cg' &&
           datainuse != 'ln' && datainuse != 'tn' && datainuse != 'cn' && 
           datainuse != 'le' && datainuse != 'ne' && datainuse != 'ce' ){
          embed.setTitle("Erro no parametro do alinhamento")
          .setColor('#FF0000')
          .addFields({name:"Verifique o que escreveu e como escreveu",value:"Verifique a pagina commands do servidor"});
          message.channel.send(embed);
          return;
        }        
      }
      sql = `UPDATE personagem SET ${onde[i]} = '${datainuse}' WHERE id = '${message.author.id}'`; 
    }
    conRPG.query(sql);
  }

  embed.setTitle("Modificação realizada com sucesso")
  .setColor('GREEN')
  .addFields(
  {name:`O campo: ${onde}`,value:"Foi modificado com sucesso"}
  );
  message.channel.send(embed);

});
  break;

//#endregion AttPersonagem

//--------------------------Apagar personagem (OK)
//#region Delete Personagem
//!rpg deletepersonagem
case "chardelete":
  if(args.length > 1){
    error(args[0]);
    return;
  }

  //verifica se a pessoa tem um personagem para apagar
  conRPG.query(`SELECT * FROM personagem WHERE id = '${message.author.id}'`, (err,rows)=>{
  if(err){
    error(args[0]);
    queryerr(1);
    return;
  }
  if(rows.length<1){
    embed.setTitle("Voce nao possui um personagem para apagar")
    .setColor('RED');
    message.channel.send(embed);
  }else{
  sql = `DELETE FROM personagem WHERE id = '${message.author.id}'`;
  conRPG.query(sql);

  embed.setTitle("Apagado")
  .setColor('GREEN')
  .addField({name:"Apagados",value:"Os dados do seu personagem"});

  message.channel.send(embed);
  }
  
  conRPG.query(`SELECT * FROM inventario WHERE idper = '${message.author.id}'`, (err,rows)=>{
  if(err){
    error(args[0]);      
    queryerr(2);
    return;
  }
  if(rows.length<1){
    embed.setTitle("Voce nao possui invetario para apagar")
    .setColor('RED');
    message.channel.send(embed);
  }else{
    sql = `DELETE FROM inventario WHERE idper = '${message.author.id}'`;
    conRPG.query(sql);

    embed.setTitle("Apagado")
    .setColor('GREEN')
    .addField({name:"Apagados",value:"Os dados do seu invetario"});

    message.channel.send(embed);
  }
  });

  //Apagar da campanha é preciso verificar se nao eh o unico na campanha
  conRPG.query(`SELECT * FROM campanha WHERE playerid = '${message.author.id}'`, (err,rows)=>{
    if(err){
      error(args[0]);
      queryerr(3);
      return;
    }
  if(rows.length < 1){ //voce nao participa de campanha
    embed.setTitle("Voce nao participa de nenhuma campanha")
    .setColor('RED');
    message.channel.send(embed);
  }else{
    let yourmester = rows[0].mestreid;

    conRPG.query(`SELECT * FROM campanha WHERE mestreid = ${yourmester}`, (err,rows)=>{
    if(err)throw err;
    if(rows.length === 1){ //Se o for o ultimo da campanha ele nao apaga a acampanha so tira o registro do player
      sql=`UPDATE campanha SET playerid = NULL, playernome = NULL WHERE mestreid = ${yourmester}`;
    }else if(rows.length > 1){
      sql = `DELETE FROM campanha WHERE playerid = ${message.author.id}`;
    }

    conRPG.query(sql);

    embed.setTitle("Apagado")
    .setColor('GREEN')
    .addField({name:"Apagados",value:"Os dados da campanha que participava"});
    
    message.channel.send(embed);
    });

  }
  });
}
);
  
break;
//#endregion Delete Personagem

//#endregion Player
    
//-----------------------------------------------------CAMPANHA (OK)
//#region Campanha

//--------------------------Alterar nome (OK)
//#region alterar o nome da campanha
//!rpg altercampname 'novo nome'
//apenas a pessoa na categoria de metre pode executar
case "campattname":
  if(args[2] != undefined){
    error(args[0]);
    return;
  }
    let altername = args[1];
    conRPG.query(`SELECT * FROM campanha WHERE mestreid = '${message.author.id}' `, (err,rows) =>{
    if(err){
      error(args[0]);
      queryerr(1);
      return;
    }
      if(rows.length < 1){

        embed.setTitle("Você nao eh mestre de nenhuma campanha")
        .setColor('RED');
      }else{
        sql = `UPDATE campanha SET nome = '${altername}' WHERE mestreid = '${message.author.id}'`;
        embed.setTitle("Nome da campanha alterado")
        .setColor('GREEN');
        conRPG.query(sql);
      }
    message.channel.send(embed);
    });

  
break;
//#endregion alterar o nome da campanha

//--------------------------Dados (OK)
//#region infos campanha
//!rpg comando (nome_jogador || mestre)   ;Se for o nome do jogador usado apresentar o nome da campanha
//mostra o nome da campanha, seu mestre, e sua descrição
case "campinfo":
  let aux2;
  if(args[2] != undefined){
    error(args[0]);
    return;
  }else{
    aux2 = args[1];
    args[1] = aux2.substring(3,(aux2.length-1));
    aux2 = args[1];
  }

  conRPG.query(`SELECT * FROM campanha WHERE mestreid = '${aux2}' OR playerid = '${aux2}'`, (err,rows) =>{
    if(err){
      error(args[0]);
      queryerr(1);
      return;
    }
  if(rows.length < 1){
    embed.setTitle("Não foi encontrado nenhuma campanha")
    .setColor('#FF0000');
  }else{
    embed.setTitle("Dados da campanha")
    .setColor('GREEN')
    .addFields(
    {name:"Nome da campanha: ", value:rows[0].nome},
    {name:"Nome do mestre: ", value:client.users.cache.get(rows[0].mestreid).username}
    );
    conRPG.query(`SELECT * FROM campanha WHERE nome = '${rows[0].nome}' and mestreid = '${aux2}' OR playerid = '${aux2}'`, (err,rows)=>{
    if(err) throw err;

    if(rows[0].playerid === null){
        embed.addFields(
          {name:"Jogadores: ",value:"Não ha jogadores nessa campanha"}
        );
    }else{
      for(i=0;i<rows.length;i++){
      embed.addFields(
        {name:"Jogador: ",value:`${client.users.cache.get(rows[i].playerid).username}`} //Cannot read property 'username' of undefined
      );
    }
    }
    message.channel.send(embed);
    });
  }
  });

break;
//#endregion infos campanha

//--------------------------Create (OK)
//#region Create campain
//!rpg comando 'nome da campanha'
case "campcreate":
  if(args.length>2){
    error(args[0]);
    return;
  }
  let nameiu = args[1].toLowerCase();

  conRPG.query(`SELECT * FROM campanha WHERE mestreid = '${message.author.id}'`, (err,rows) =>{
    if(err){
      error(args[0]);
      queryerr(1);
      return;
    }
  if(rows.length < 1){  //Se a pessoa nao tem nenhuma campanha em seu nome ele pode criar uma             
    let sql = `INSERT INTO campanha (nome,mestreid,mestrenome) VALUES ('${nameiu}','${message.author.id}','${client.users.cache.get(message.author.id).username}')`;
    embed.setTitle("Camapanha criada com sucesso")
    .setColor('GREEN');  
    conRPG.query(sql);                                  
  }else{
    embed.setTitle("Você ja possui uma campanha")
    .setColor('#FF0000');
  }
  message.channel.send(embed);
  });
       
break;
//#endregion Create campain

//--------------------------Delete (OK)
//Apenas o mestre da campanha pode deletar a campanha
//#region Delete campain
case "campdelete":
  if(args[1] != undefined){
    error(args[0]);
    return;
  }

  conRPG.query(`SELECT * FROM campanha WHERE mestreid = '${message.author.id}'`, (err,rows) => {
  if(err){
    error(args[0]);
    queryerr(1);
    return;
  }
  if(rows.length < 1){
    embed.setTitle("Você não possui uma campanha")
    .setColor('#FF0000');
  }else{
    let sql = `DELETE FROM campanha WHERE mestreid = '${message.author.id}'`;
    embed.setTitle("Campanha apagada com sucesso")
    .setColor('GREEN');  
    conRPG.query(sql);  
  }
  message.channel.send(embed);
  });

break;
//#endregion Delete campain

//--------------------------Adicionar player na campanha (OK)
//Apenas o mestre da campanha pode adicionar jogadores a campanha
//#region add player
//!rpg comando @player
case "campaddplayer":
  //Pegando o id do player selecionado atravez do @...
  let aux4;
  if(args[2] != undefined){
    error(args[0]);
    return;
  }else{
    aux4 = args[1];
    args[1] = aux4.substring(3,(aux4.length-1));
    aux4 = args[1];
  }
  
  //verificar se o player tem um personagem, se sim adiciona-lo a campanha do author caso ela exista
  conRPG.query(`SELECT * FROM personagem WHERE id = ${aux4}`, (err,rows)=>{
    if(err){
      error(args[0]);
      queryerr(1);
      return;
    }

  if(rows.length < 1){ //caso o player selecionado nao tenha um personagem
    embed.setTitle("Nao possui personagem")
    .setColor('#FF0000')
    .addFields(
      {name:`O jogador ${client.users.cache.get(aux4).username}`, value:"Nao possui um personagem"}
    );
    message.channel.send(embed);

  }else{ //caso o player tenha um personagem
    let playerinserted = rows[0].id;

    conRPG.query(`SELECT  * FROM campanha WHERE mestreid = '${message.author.id}'`, (err,rows) =>{
      if(err){
        error(args[0]);
        queryerr(2);
        return;
      }

    if(rows.length < 1){ //caso o autor nao tenha uma campanha
      embed.setTitle("Você não possui uma campanha")
      .setColor('#FF0000');
      message.channel.send(embed);

    }else{

      let nomecamp = rows[0].nome;
      let mestrecamp = rows[0].mestreid;
      let mestrename = rows[0].mestrenome;
      let flag = 0;

      //Esse for serve para achar ao menos uma linha onde a coluna playerid seja nula e ai informa atraves da flag
      let i = 0;
      do{
        if(rows[i].playerid === null){    
        flag = 1;}
        i++;  
      }while(i<rows.length && flag != 1);
      
      //Aqui é procurado se o player ja existe nessa campanha
      conRPG.query(`SELECT * FROM campanha WHERE mestreid = '${message.author.id}' AND playerid = '${playerinserted}'`, (err,rows)=>{
        if(err){
          error(args[0]);
          queryerr(3);
          return;
        }
        let sql;
        
        if(rows.length < 1){  //se nao existir ESSE player na campanha

        if(flag === 1){ //caso exista uma linha com playerid nulo
        sql = `UPDATE campanha SET playerid = '${playerinserted}', playernome = '${client.users.cache.get(playerinserted).username}' WHERE playerid IS NULL LIMIT 1`; //aqui deve ser uptade 
        }else{ //caso nao tenha linha com playerid nulo inserir
        sql = `INSERT INTO campanha (nome,mestreid,mestrenome,playerid,playernome) VALUES ('${nomecamp}','${mestrecamp}','${mestrename}','${playerinserted}','${client.users.cache.get(playerinserted).username}')`; 
        }
        
        conRPG.query(sql); 

        embed.setTitle("Inserido com Sucesso")
        .setColor('GREEN');

        }else{
          embed.setTitle("Esse jogador ja esta na sua campanha")
          .setColor('#FF0000');
          
        }
        message.channel.send(embed);
      });
      
    }
    });

  }   
  });  

break;
//#endregion add player

//--------------------------Sair de uma campanha  (OK)
//#region Sair da campanha 
case "campexit":
  conRPG.query(`SELECT * FROM campanha WHERE playerid = ${message.author.id}`, (err,rows)=>{
    if(err){
      error(args[0]);
      queryerr(1);
      return;
    }
  if(rows.length<1){
    embed.setTitle("Você nao participa de nenhuma campanha")
    .setColor('#FF0000');
    
  }else{
    let mestre = rows[0].mestreid;
    conRPG.query(`SELECT * FROM campanha WHERE mestreid = ${mestre}`, (err,rows)=>{
      if(err){
        error(args[0]);
        queryerr(2);
        return;
      }
    let sql;
    if(rows.length === 1){ //Se o for o ultimo da campanha ele nao apaga a acampanha so tira o registro do player
      sql=`UPDATE campanha SET playerid = NULL WHERE mestreid = ${mestre}`;
    }else if(rows.length > 1){
      sql = `DELETE FROM campanha WHERE playerid = ${message.author.id}`;
    }
      conRPG.query(sql);
    });
    embed.setTitle("Você foi removido com Sucesso")
    .setColor('GREEN');
    
  }
  message.channel.send(embed);
  });
break;
//#endregion Sair da campanha

//#endregion Campanha

//-----------------------------------------------------INVENTARIO
//#region  Inventario

//#region additem
//!rpg comando jogador (item) (qtdd)
    //adiciona um item a um inventario e a quantidade ; se o item existir so adiciona em qtdd senao adiciona o item e a qtdd
    //apenas a pessoa na categoria de metre pode executar
case "additem":   //pode adicionar 
  if(args.length > 4 && args.length < 4){
    error(args[0]);
    return;
  }
  let pezoa = getid();
  let item = separateCOMA(args[2]);
  let qtdds = separateCOMA(args[3]);  
  let flag = contInsercao = 0;
  let jooj;
  let msg = karlos = 0;
  if(verifqtdd(item,6) || item.length != qtdds.length){
    error(args[0]);
    return;
  }
    
  //verificar se quem mandou a mensagem eh um mestre e o player selecionado eh da campanha e verificar se esse player nao tem mais que 6 rows de inventario
  conRPG.query(`SELECT * FROM campanha WHERE mestreid = ${message.author.id}`, (err,rows)=>{
    if(err){
      error(args[0]);
      queryerr(1);
      return;
    }
  if(rows.length<1){
    embed.setTitle("Voce nao eh mestre de campanha")
    .setColor('#FF0000');
    message.channel.send(embed);
    return;
  }

  //verificar se o player escolhido participa da sua campanha
    conRPG.query(`SELECT * FROM campanha WHERE mestreid = ${message.author.id} AND playerid = ${pezoa}`, (err,rows)=>{
      if(err){
        error(args[0]);
        queryerr(2);
        return;
      }
    if(rows.length<1){
      embed.setTitle("O jogador nao participa da campanha")
      .setColor('#FF0000');
      message.channel.send(embed);
      return;
    }
      
  //verificar se o player escolhido tem um inventario
  //necessario verificar se nao tem itens no inventario, se tiver ver se tem algum para atualizar, se nao adiciona como nova até completar 6
      conRPG.query(`SELECT * FROM inventario WHERE idper = '${pezoa}'`, (err,rows)=>{
        if(err){
          error(args[0]);
          queryerr(3);
          return;
        }

      //se nao existe linhas do inventario ou elas sao menores que 6 pode adicionar 
      if(rows.length<1){
        for(i=0;i<item.length;i++){
          jooj = `INSERT INTO inventario (idper,item,qtdd) VALUES ('${pezoa}','${item[i]}','${qtdds[i]}')`;
          conRPG.query(jooj);
          msg = 1;
        }
      }else{ //existem itens no inventario, verificar se algum item ja existe 
        for(i=0;(i<item.length)&&((rows.length + contInsercao) < 6);i++){
          flag = 0;
          for(karlos=0;(karlos<rows.length) && flag != 1;karlos++){
            if(rows[karlos].item === item[i]){
            flag = 1;
            //significa que o item observado existe na row j entao deve atualizar (nao tem como adicionar ou retirar so atualizar)
            jooj = `UPDATE inventario SET qtdd = '${qtdds[i]}' WHERE item = '${item[i]}'`;
            conRPG.query(jooj);
            msg = 1;
            } 
          }
        //se flag é 0 significa que nao existe esse item no invetario
          if(flag === 0){ 
            contInsercao++;
            //aqui ele verifica se as linhas existentes mais o que vai ser inserido ultrapassam 6
            if((rows.length + contInsercao) < 6){ //se nao passar pode inserir 
              jooj = `INSERT INTO inventario (idper,item,qtdd) VALUES ('${pezoa}','${item[i]}','${qtdds[i]}')`;
              conRPG.query(jooj);
              msg = 1;
            } 
            
          }

        }
      }
        if(msg === 1){
        embed.setTitle("Itens adicionados com sucesso")
        .setColor('GREEN');
        }else{
        embed.setTitle("Falha ao adicionar items")
        .addFields({name:"Alguns itens podem nao terem sido inseridos",value:"Devido o espaço total do inventario"})
        .setColor('RED');
        }
        message.channel.send(embed); 
      });

  });
      
});
break;
//#endregion additem

//#region remitem
    //!rpg comando jogador (items) 
    //apaga a linha inteira do inventario
    //apenas a pessoa na categoria de metre pode executar
    case "remitem":
      if(args.length > 3 && args.length < 3){
        error(args[0]);
        return;
      }
      
      let itens = separateCOMA(args[2]);
      if(verifqtdd(itens,6)){
        error(args[0]);
        return;
      }

      conRPG.query(`SELECT * FROM campanha WHERE mestreid = ${message.author.id}`, (err,rows)=>{
        if(err){
          error(args[0]);
          queryerr(1);
          return;
        }
        if(rows.length<1){
          embed.setTitle("Voce nao eh mestre de campanha")
          .setColor('#FF0000');
          message.channel.send(embed);
          return;
        }

        conRPG.query(`SELECT * FROM campanha WHERE mestreid = ${message.author.id} AND playerid = ${pezoa}`, (err,rows) => {
          if(err){
            error(args[0]);
            queryerr(2);
            return;
          }
        if(rows.length<1){
          embed.setTitle("O jogador nao participa da campanha")
          .setColor('#FF0000');
          message.channel.send(embed);
          return;
        }

          conRPG.query(`SELECT * FROM inventario WHERE mestreid = ${message.author.id} AND playerid = ${pezoa}`, (err,rows)=>{
            if(err){
              error(args[0]);
              queryerr(3);
              return;
            }
            if(rows.length<1){
              embed.setTitle("O jogador nao tem itens no inventario")
              .setColor('#FF0000');
              message.channel.send(embed);
            }else{
              for(i=0;i<itens.length;i++){
                for(j=0;j<rows.length;j++){
                  if(itens[i] === rows[j].item){
                    sql = `DELETE FROM inventario WHERE playerid = ${pezoa} AND item = ${itens[i]}`
                    conRPG.query(sql);
                    msg = 1;
                  }
                }
              }
              if(msg === 1){
              embed.setTitle("Item(s) excluidos")
              .setColor('GREEN');
              message.channel.send(embed);
              }
            }
          });

        });
          
      });

    break;
    //#endregion remitem
    
//#region invent
    //!rpg comando jogador 
    //apresenta os itens do inventario de alguem
    case "itens":
      if(args.length > 2 || args.length<1){
        error(args[0]);
        return;
      }
      if(args.length === 2){
        who = getid();
      }else{
        who = message.author.id;
      }

      conRPG.query(`Select * from inventario where idper = ${who}`, (err,rows)=>{
        if(err){
          error(args[0]);
          queryerr(1);
          return;
        }
      if(rows.length<1){
        embed.setTitle("Voce nao tem inventario")
        .setColor('#FF0000');
        message.channel.send(embed);
        return;
      }
      embed.setTitle("Inventario");
      for(i=0;i<rows.length;i++){
      embed.addFields({name:'item: '+rows[i].item,value:'quantidade: '+rows[i].qtdd});
      }
      message.channel.send(embed);
      });

    break;
//#endregion invent

//#endregion Inventario  

//-----------------------------------------------------ADD 
//#region add
//!rpg add (gold/xp) adder @...
case "add":

//defindindo qual id usar e salvo em aux1
  let aux;
  if(args[4] != undefined){
    error(args[0]);
    return;
  }else{
    aux = args[3];
    args[3] = aux.substring(3,(aux.length-1));
    aux = args[3];
  }

//fazer a verificação de metre e campanha
  conRPG.query(`SELECT * FROM campanha WHERE mestreid = '${message.author.id}'`, (err,rows) =>{
    if(err){
      error(args[0]);
      queryerr(1);
      return;
    }

  if(rows.length < 1){  //quem mandou a mensagem nao eh mestre em nenhuma campanha
  embed.setTitle("Você não é mestre de nenhuma campanha")
  .setColor('#FF0000');
  message.channel.send(embed);

  }else{  //foi encontrado rows onde quem mandou a mensagem é mestre de uma campanha

    conRPG.query(`SELECT * FROM campanha WHERE mestreid = '${message.author.id}' and playerid = '${aux}'`, (err,rows) =>{
      if(err){
        error(args[0]);
        queryerr(2);
        return;
      }

      if(rows.length < 1){ //nao foi achado jogador com voce de mestre
        embed.setTitle("O jogador selecionado nao está na sua campanha")
        .setColor('#FF0000');
        message.channel.send(embed);

      }else{ //foi achado o jogador na sua campanha

        conRPG.query(`SELECT * FROM personagem WHERE id = '${aux}'`, (err,rows) =>{
          if(err){
            error(args[0]);
            queryerr(3);
            return;
          }
          let base;

          if(args[1] === 'xp'){
            base = rows[0].xp; // ele nao a pegando o xp ta dando NaN ou undefined
          }else{
            base = rows[0].gold;
          }

          let add = parseInt(args[2]);

          if((base+add) < 0 ){  //Não eh possivel deixar xp negativo ou gold
            embed.setTitle(`Nao é possivel deixar ${args[1]} negativo`)
            .setColor('#FF0000');
            message.channel.send(embed);
            return;
          }
          
          let sql = `UPDATE personagem SET ${args[1]} = ${(base+add)} WHERE id = '${aux}'`;
          conRPG.query(sql);
          
          embed.setTitle(`${args[1]} modeficado com Sucesso`)
          .setColor('GREEN');
          message.channel.send(embed);
        });
        
      }
    });

  }  
});
break;
//#endregion add

//-----------------------------------------------------XP
//#region info
//--------------------------Apresenta XP

    //!RPG comando 'nome_player'
    //apresenta o lvl do personagem
    case "info":
      //defindindo qual id usar e salvo em aux1
      let aux1;

      if(args[1] != undefined){
        aux1 = args[1];
        args[1] = aux1.substring(3,(aux1.length-1));
        aux1 = args[1];
      }else{
        aux1 = message.author.id; 
      } 
      
      //fazendo o acesso ao Banco
      conRPG.query(`SELECT * FROM personagem WHERE id = '${aux1}'`, (err,rows) => {
        if(err){
          error(args[0]);
          queryerr(1);
          return;
        }
      embed.setTitle("Experiência");

      if(args[2]==='xp'){
        if(!rows[0].xp){
        embed.setColor('#FF0000')
        .addFields({name:"Esse usuario", value:"Nao tem pontos de experiencia"});
        }else{
        embed.setColor('#ADDDDC')
        .addFields({name:`${client.users.cache.get(aux1).username} tem: `, value:`${rows[0].xp} de experiencia`}); //usando o id de aux1 printar o nome
        }
      }else if(args[2]==='gold'){
        if(!rows[0].gold){
          embed.setColor('#FF0000')
          .addFields({name:"Esse usuario", value:"Nao tem moedas de ouro"});
          }else{
          embed.setColor('#ADDDDC')
          .addFields({name:`${client.users.cache.get(aux1).username} tem: `, value:`${rows[0].gold} moedas de ouro`}); //usando o id de aux1 printar o nome
          }
      }else{
          if(!rows[0].xp){
          embed.setColor('#FF0000')
          .addFields({name:"Esse usuario", value:"Nao tem pontos de experiencia"});
          }else{
          embed.setColor('#ADDDDC')
          .addFields({name:`${client.users.cache.get(aux1).username} tem: `, value:`${rows[0].xp} de experiencia`}); //usando o id de aux1 printar o nome
          }
          if(!rows[0].gold){
            embed.setColor('#FF0000')
            .addFields({name:"Esse usuario", value:"Nao tem moedas de ouro"});
            }else{
            embed.setColor('#ADDDDC')
            .addFields({name:`${client.users.cache.get(aux1).username} tem: `, value:`${rows[0].gold} moedas de ouro`}); //usando o id de aux1 printar o nome
          }
      }
      
        message.channel.send(embed);
      });
    break;

//#endregion info
}
break;
//#endregion rpg

//-----------------------------------------------------DEFAULT
//#region DEFAULT
//Caso nao tenha entrado em nenhuma função
//Tentar por uma imagem de warning
  default:
    embed.setTitle("Error")
    .setColor('#FF0000')
    .addFields(
    {name:"Possíveis problemas ",value:"1- Comando não existente"},
    {name:"ou",value:"2- Argumentos inválidos do comando desejado"}
  );   
  break;
//#endregion DEFAULT

}

//Se o comando nao for nem RPG nem XP nao usa esses comando referentes ao embed
if(cmd != "xp" && cmd != "rpg"){
embed.setTimestamp(); 
message.channel.send(embed);
}
  
});
//#endregion Message

//-----------------------------------------------------
//Inicialização propriamente dita do BOT
//pegar o token
client.login(config.token);