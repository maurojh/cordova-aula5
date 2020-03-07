var db = openDatabase('banco', '1.0', 'primeiro banco', 2 * 1024 * 1024);

// transaction: se algo der errado não altera o banco:
db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS consumos (id INTEGER PRIMARY KEY AUTOINCREMENT, litros TEXT NOT NULL, km TEXT NOT NULL)');
    var saida = document.getElementById("saida");
    saida.innerHTML = "Tabela criada";
});

function salvar() {
    var litros = document.getElementById("litros");
    var km = document.getElementById("km");

    var valor_litros = litros.value;
    var valor_km = km.value;

    if (valor_litros != "" && valor_km != "") {
        valor_litros = valor_litros.replace(",", ".");
        valor_km = valor_km.replace(",", ".");

        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO consumos ( litros, km) VALUES ( ?, ?)', [valor_litros, valor_km]);
            var saida = document.getElementById("saida");
            saida.innerHTML = "Item salvo";
            
            document.getElementById("km").value = "";
            document.getElementById("litros").value = "";
            navigator.vibrate(3000);
        });
    }
}

//window.onload = function () {
document.addEventListener("deviceready", pronto, false);

function pronto() {
    var botao = document.getElementById("botao");
    botao.addEventListener("click", function () {
        salvar();
        media();
    });
}

function media() {
    db.transaction(function (tx) {
        tx.executeSql('SELECT km, litros FROM consumos', [], function (tx, resultado) {
            var qtd_linhas = resultado.rows.length,
                i;
            var kms = 0,
                litros = 0;
            msg = "";

            for (i = 0; i < qtd_linhas; i++) {
                kms += Number(resultado.rows.item(i).km);
                litros += Number(resultado.rows.item(i).litros);
            }
            var media = kms / litros;
            msg += "Km/litros: " + media;

            document.getElementById("saida2").innerHTML = msg;
        }, null);
    });
}


//        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  