const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');

const app = express();
const port = 3000;

// XML解析器
const parser = new xml2js.Parser();

app.get('/danmaku', async (req, res) => {
    const { bv, cid } = req.query;
    let cidValue = cid;

    if (!bv && !cid) {
        return res.status(400).send('Either BV number or CID is required');
    }

    try {
        if (!cid) {
            // 使用新的API获取cid
            const cidResponse = await axios.get(`https://api.bilibili.com/x/player/pagelist?bvid=${bv}&jsonp=json`);
            cidValue = cidResponse.data.data[0].cid;
            console.log("bv " + bv + " 的cid获取成功！")
        }

        // 获取Bilibili弹幕XML
        const response = await axios.get(`http://api.bilibili.com/x/v1/dm/list.so?oid=${cidValue}`);
        const xmlData = response.data;

        // 解析XML数据
        parser.parseString(xmlData, (err, result) => {
            if (err) {
                console.log("cid " + cidValue + " 弹幕解析失败！")
                return res.status(500).send('Error parsing XML');
            }
            console.log("cid " + cidValue + " 弹幕解析成功！")

            // 转换为dplayer的弹幕格式
            const danmakuList = result.i.d.map(d => {
                const p = d.$.p.split(',');
                return {
                    time: parseFloat(p[0]),
                    type: parseInt(p[1]),
                    color: parseInt(p[3]),
                    author: p[6],
                    text: d._
                };
            });

            res.json({
                code: 0,
                data: danmakuList
            });
        });
    } catch (error) {
        console.log("cid " + cidValue + " 弹幕获取失败！")
        res.status(500).send('Error fetching danmaku');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
