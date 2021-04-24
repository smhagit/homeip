var request = require('request');

if (!process.env.HETZNER_RECORD_ID || !process.env.HETZNER_ZONE_ID || !process.env.HETZNER_RECORD_NAME || !process.env.HETZNER_API_TOKEN) {
    console.error('Error: Please provide a HETZNER_RECORD_ID, a HETZNER_ZONE_ID, HETZNER_RECORD_NAME and HETZNER_API_TOKEN');
    process.exit(0);
}


function checkAndUpdate() {
    request('https://api.ipify.org', (error, response, publicIP) => {
        if (!error && response.statusCode == 200) {
        console.log(`gathered public IP: ${publicIP}`);
    
        // let's update hetzner dns
        request({
            method: 'PUT',
            url: `https://dns.hetzner.com/api/v1/records/${process.env.HETZNER_RECORD_ID}`,
            json: {
                value: publicIP,
                ttl: process.env.HETZNER_RECORD_TTL || 3600,
                type: process.env.HETZNER_RECORD_TYPE || "A",
                name: process.env.HETZNER_RECORD_NAME,
                zone_id: process.env.HETZNER_ZONE_ID
            },
            headers: {
                'Content-Type': 'application/json',
                'Auth-API-Token': process.env.HETZNER_API_TOKEN
            }},
            (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    console.log(`updated hetzner dns`);
                } else {
                    console.log(`error while updating hetzner dns: ${response.statusCode}`);
                }
            }
        );
        }
        else {
        console.log(`error gathering public ip: ${response.statusCode}`);
        }
    });
}


function sleep(sec) {
    return new Promise((resolve) => {
        setTimeout(resolve, parseInt(sec) * 1000);
    });
}


(async () => {
    do {
        checkAndUpdate();
        await sleep(process.env.INTERVAL || 5400);
    } while (true);
})();
