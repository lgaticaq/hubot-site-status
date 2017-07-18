# hubot-site-status

check for down sites

See [`src/site-status.js`](src/site-status.js) for full documentation.

## Installation

In hubot project repo, run:

`npm i -S hubot-site-status `

Then add **hubot-site-status** to your `external-scripts.json`:

```json
["hubot-site-status"]
```

Optional set HUBOT_SITES_CHANNEL to override default channel notification. Default general.

## Sample Interaction

```
user>> hubot sites add [url]
hubot>> Sitio agregado [url]
```
```
user>> hubot sites delete [url]
hubot>> Sitio eliminado [url]
```
```
user>> hubot sites all
hubot>> [url] [url] [url] 
```
