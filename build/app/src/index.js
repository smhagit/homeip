var request = require('request');

function updateDns(ipAddress, recordName, recordId) {
    request({
        method: 'PUT',
        url: `https://dns.hetzner.com/api/v1/records/${recordId}`,
        json: {
            value: ipAddress,
            ttl: process.env.HETZNER_RECORD_TTL || 3600,
            type: process.env.HETZNER_RECORD_TYPE || "A",
            name: recordName,
            zone_id: process.env.HETZNER_ZONE_ID
        },
        headers: {
            'Content-Type': 'application/json',
            'Auth-API-Token': process.env.HETZNER_API_TOKEN
        }},
        (error, response, body) => {
            if (!error && response.statusCode == 200) {
                console.log(`updated hetzner dns ${recordId} ${recordName} => ${ipAddress}`);
            } else {
                console.log(`error while updating hetzner dns: ${response.statusCode}`);
            }
        }
    );
}

function checkAndUpdate() {
    request('https://api.ipify.org', (error, response, publicIP) => {
        if (!error && response.statusCode == 200) {
            console.log(`gathered public IP: ${publicIP}`);

            // let's update hetzner dns
            const envs = process.env;
            let nameAndRecords;
            // Check if we have multiple records
            if ("HETZNER_RECORD_NAME_1" in envs) {
                const envNameNumbers = Object.keys(envs).filter(key => key.startsWith('HETZNER_RECORD_NAME_')).map(key => key.substring(20));
                nameAndRecords = envNameNumbers.map(nameNumber => {
                    return {
                        name: envs['HETZNER_RECORD_NAME_' + nameNumber],
                        recordId: envs['HETZNER_RECORD_ID_' + nameNumber]
                    };
                });
            }
            else {
                nameAndRecords = [{
                    name: envs['HETZNER_RECORD_NAME'],
                    recordId: envs['HETZNER_RECORD_ID']
                }];
            }

            nameAndRecords.forEach(item => updateDns(publicIP, item.name, item.recordId));
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
