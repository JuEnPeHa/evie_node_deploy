# evie_node

API del servidor node de EVIE Marketplace.
Todas las peticiones deben ser realizadas mediante una peticion GET.

URL usada para pruebas:
https://evienode.juanenriqueenr4.repl.co/api/near/

Sufijo Mainnet:
mainnet/

Sufijo Testnet:
testnet/

Funciones solo disponibles en Mainnet:

https://evienode.juanenriqueenr4.repl.co/api/near/mainnet/getMostSelledCollections?5
Recibe: El límite de colecciones
?5
Devuelve: Las colecciones más vendidas

https://evienode.juanenriqueenr4.repl.co/api/near/mainnet/getLandingPageMintbase
Recibe: Nada
Devuelve: La información de la landing page de mintbase (Stores)

https://evienode.juanenriqueenr4.repl.co/api/near/mainnet/getLandingPageParas
Recibe: Nada
Devuelve: La información de la landing page de paras (Collections)

Funciones disponibles en Mainnet y Testnet:

```
Mainnet:
https://evienode.juanenriqueenr4.repl.co/api/near/mainnet/getNftTokensBySeries?TokenSeriesId=500
```
```
Testnet:
https://evienode.juanenriqueenr4.repl.co/api/near/testnet/getNftTokensBySeries?TokenSeriesId=150
```
Recibe: El id de la serie de tokens
?TokenSeriesId=500
Devuelve: Los tokens de la serie indicada

```
Mainnet:
https://evienode.juanenriqueenr4.repl.co/api/near/mainnet/getNftGetSeriesSingle?TokenSeriesId=500
```
```
Testnet:
https://evienode.juanenriqueenr4.repl.co/api/near/testnet/getNftGetSeriesSingle?TokenSeriesId=150
```
NOTA: Diferente función pero igual resultado que la anterior
Recibe: El id de la serie de tokens
?TokenSeriesId=500
Devuelve: La información de la serie de tokens indicada
    
```
Mainnet:
https://evienode.juanenriqueenr4.repl.co/api/near/mainnet/getNftGetSeries?from=50&limit=10
```
```
Testnet:
https://evienode.juanenriqueenr4.repl.co/api/near/testnet/getNftGetSeries?from=50&limit=10
```
Recibe: Un número From y un número Limit
?from=50&limit=10
Devuelve: Una lista paginada de Colecciones.
 
```
Mainnet:
https://evienode.juanenriqueenr4.repl.co/api/near/mainnet/getMetadata?account=jeph.near
```
```
Testnet:
https://evienode.juanenriqueenr4.repl.co/api/near/testnet/getMetadata?account=jeph.testnet
```
Recibe: El nombre de una cuenta
?account=jeph.near
Devuelve: Los tokens que tenga la cuenta indicada en los marketplaces ya precargados.

```
Mainnet:
https://evienode.juanenriqueenr4.repl.co/api/near/mainnet/getSupply?receivedContract=x.paras.near
```
```
Testnet:
https://evienode.juanenriqueenr4.repl.co/api/near/testnet/getSupply?receivedContract=paras-token-v2.testnet
```
Recibe: El nombre de un contrato
?receivedContract=x.paras.near
Devuelve: El número de tokens que tiene dicho marketplace.

```
Mainnet:
https://evienode.juanenriqueenr4.repl.co/api/near/mainnet/getTokens?account=jeph.near&receivedContract=x.paras.near
```
```
Testnet:
https://evienode.juanenriqueenr4.repl.co/api/near/testnet/getTokens?account=jeph.testnet&receivedContract=paras-token-v2.testnet
```
Recibe: El nombre de una cuenta y un contrato
?account=jeph.near&receivedContract=x.paras.near
Devuelve: Una lista de tokens que tiene la cuenta indicada en el contrato indicado.

```
Mainnet:
