const API_URL = `https://api.phisherman.be`;
// const API_URL = `http://192.168.1.9:3012`;
// const API_URL = `http://localhost:3012`;
/**
 * USER
 *
 */

export const fetchtoken = () => localStorage.getItem(`phisher_token`);
export const removetoken = () => localStorage.removeItem(`phisher_token`);
const setToken = token => localStorage.setItem(`phisher_token`, token);

export const isAuthenticated = cb => {
    validate(success => {
        if (success) {
            cb(fetchtoken());
        } else {
            removetoken();
            cb(null);
        }
    });
};

const validate = cb => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/validate`, {
            method: `GET`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(r => r.json())
            .then(answer => cb(answer.message === `Success`))
            .catch(error => console.log(error));
    }
};

export const register = (firstname, lastname, email, password, company, cb) => {
    fetch(`${API_URL}/users/register`, {
        method: `POST`,
        headers: {
            'content-type': `application/json;charset=utf-8`
        },
        body: JSON.stringify({
            firstname,
            lastname,
            email,
            password,
            company
        })
    })
        .then(r => r.json())
        .then(data => cb(data));
};

export const login = (username, password, cb) => {
    fetch(`${API_URL}/users/login`, {
        method: `POST`,
        headers: {
            'content-type': `application/json;charset=utf-8`
        },
        body: JSON.stringify({
            username,
            password
        })
    })
        .then(r => r.json())
        .then(data => {
            if (data.message === `Success`) {
                setToken(data.token);
            }
            cb(data);
        });
};

export const fetch_profile = cb => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/users/me`, {
            method: `GET`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

export const update_profile = (user, cb) => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/users/me`, {
            method: `PUT`,
            headers: {
                'content-type': `application/json;charset=utf-8`,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                company: user.company,
                public_smtp: user.public_smtp
            })
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

export const update_card = (user, cb) => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/users/me`, {
            method: `PUT`,
            headers: {
                'content-type': `application/json;charset=utf-8`,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                card: user.card
            })
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

export const update_smtp = (user, cb) => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/users/me`, {
            method: `PUT`,
            headers: {
                'content-type': `application/json;charset=utf-8`,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                smtp: user.smtp
            })
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

export const update_password = (user, cb) => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/users/me`, {
            method: `PUT`,
            headers: {
                'content-type': `application/json;charset=utf-8`,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                password: user.password
            })
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

export const delete_card = cb => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/users/me?deleteCard=true`, {
            method: `PUT`,
            headers: {
                'content-type': `application/json;charset=utf-8`,
                Authorization: `Bearer ${token}`
            }
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

/**
 * TARGET
 *
 */

export const create_target = (name, email, address, cb) => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/targets`, {
            method: `POST`,
            headers: {
                'content-type': `application/json;charset=utf-8`,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                email,
                address
            })
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

export const fetch_targets = cb => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/targets`, {
            method: `GET`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

export const fetch_target = (_id, cb) => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/targets/${_id}`, {
            method: `GET`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

export const search_targets = (query, cb) => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/targets/search/${query}`, {
            method: `GET`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

export const search_targets_in_campaign = (query, campaign_id, cb) => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/targets/search/${query}?campaign=${campaign_id}`, {
            method: `GET`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

export const update_target = (target, cb) => {
    let body = {};
    const {_id, name, email, address} = target;
    if (name) body.name = name;
    if (email) body.email = email;
    if (address) body.address = address;
    body = JSON.stringify(body);
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/targets/${_id}`, {
            method: `PUT`,
            headers: {
                'content-type': `application/json;charset=utf-8`,
                Authorization: `Bearer ${token}`
            },
            body
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

export const delete_target = (_id, cb) => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/targets/${_id}`, {
            method: `DELETE`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

/**
 * CAMPAIGN
 *
 */

export const run_campaign = (_id, cb) => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/phishing?campaign=${_id}`, {
            method: `POST`,
            headers: {
                'content-type': `application/json;charset=utf-8`,
                Authorization: `Bearer ${token}`
            }
        })
            .then(r => r.json())
            .then(data => {
                if (cb) cb(data);
            });
    }
};

export const create_campaign = (name, module, targets, cb) => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/campaigns`, {
            method: `POST`,
            headers: {
                'content-type': `application/json;charset=utf-8`,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                module,
                targets
            })
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

export const fetch_campaigns = cb => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/campaigns`, {
            method: `GET`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

export const fetch_campaign = (_id, cb) => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/campaigns/${_id}`, {
            method: `GET`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

export const update_campaign = (campaign, cb) => {
    let body = {};
    const {_id, name, targets} = campaign;
    if (name) body.name = name;
    //if (campaign.module) body.module = campaign.module;
    if (targets) body.targets = targets.map(t => t._id);
    body = JSON.stringify(body);
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/campaigns/${_id}`, {
            method: `PUT`,
            headers: {
                'content-type': `application/json;charset=utf-8`,
                Authorization: `Bearer ${token}`
            },
            body
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

export const delete_campaign = (_id, cb) => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/campaigns/${_id}`, {
            method: `DELETE`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

/**
 * RUNS
 *
 */

export const delete_run = (_id, cb) => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/runs/${_id}`, {
            method: `DELETE`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

/**
 * MODULES
 *
 */

export const create_module = (name, from, subject, mail, redirect_url, cb) => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/modules`, {
            method: `POST`,
            headers: {
                'content-type': `application/json;charset=utf-8`,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                from,
                subject,
                mail,
                redirect_url
            })
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

export const fetch_modules = cb => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/modules`, {
            method: `GET`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

export const fetch_module = (_id, cb) => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/modules/${_id}`, {
            method: `GET`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

export const update_module = (mmodule, cb) => {
    let body = {};
    const {_id, name, from, subject, mail, redirect_url} = mmodule;
    if (name) body.name = name;
    if (from) body.from = from;
    if (subject) body.subject = subject;
    if (mail) body.mail = mail;
    if (redirect_url) body.redirect_url = redirect_url;
    body = JSON.stringify(body);
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/modules/${_id}`, {
            method: `PUT`,
            headers: {
                'content-type': `application/json;charset=utf-8`,
                Authorization: `Bearer ${token}`
            },
            body
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

export const delete_module = (_id, cb) => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/modules/${_id}`, {
            method: `DELETE`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

/**
 * PAYMENTS
 *
 */

export const buy_credits = (amount, pack, cb) => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/payments${pack ? `?pack=${pack}` : ``}`, {
            method: `POST`,
            headers: {
                'content-type': `application/json;charset=utf-8`,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                amount
            })
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

export const fetch_packs = cb => {
    const token = fetchtoken();
    if (token) {
        fetch(`${API_URL}/payments/packs`, {
            method: `GET`,
            headers: {
                'content-type': `application/json;charset=utf-8`,
                Authorization: `Bearer ${token}`
            }
        })
            .then(r => r.json())
            .then(data => cb(data));
    }
};

export const setup_sse = func => {
    const token = fetchtoken();
    if (token) {
        const ev = new EventSource(`${API_URL}/payments?user=${token}`);
        ev.addEventListener(`update`, result => {
            func(result);
        });
        return ev;
    }
};
