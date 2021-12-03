const http = require('http');
const fs = require('fs').promises;

http.createServer(async (req, res) => {
    try {
        if (req.url=='/') {
            const data = await fs.readFile('test.html');
            res.writeHead(200, {'Content-Type' : 'html/text'});
            return res.end(data);
        }

        else if (req.url =='/all') {
            const data = await fs.readFile('all.json');
            res.writeHead(200, {'Content-Type': 'text/html'});
            return res.end(data);
        }
        else if (req.url =='/top') {
            const data = await fs.readFile('top.json');
            res.writeHead(200, {'Content-Type': 'text/html'});
            return res.end(data);
        }
        else if (req.url =='/jng') {
            const data = await fs.readFile('jng.json');
            res.writeHead(200, {'Content-Type': 'text/html'});
            return res.end(data);
        }
        else if (req.url =='/mid') {
            const data = await fs.readFile('mid.json');
            res.writeHead(200, {'Content-Type': 'text/html'});
            return res.end(data);
        }
        else if (req.url =='/adc') {
            const data = await fs.readFile('adc.json');
            res.writeHead(200, {'Content-Type': 'text/html'});
            return res.end(data);
        }
        else if (req.url =='/sup') {
            const data = await fs.readFile('sup.json');
            res.writeHead(200, {'Content-Type': 'text/html'});
            return res.end(data);
        }
        try {
            const data = await fs.readFile(`.${req.url}`);
            return res.end(data);
        } catch (err) {
            res.writeHead(404, {'Content-Type' : 'text/html'});
            return
        }
    } catch (err) {
        res.writeHead(404, {'Content-Type' : 'text/html'});
        return
    }
})
    .listen(3000, () => {
        console.log(`Server running at 3000...`);
    })