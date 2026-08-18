# Aether — local launch (no Google Cloud)

## No sign-in (personal)
```bash
cd frontend
cp .env.example .env   # REACT_APP_NO_AUTH=true
yarn install
yarn start
```
Open http://localhost:3000

Or in browser console:
```js
localStorage.setItem('aether.noAuth', '1');
location.href = '/';
```

## USB bridge
```bash
cd aether-cli
cargo build --release
./target/release/aether-cli serve
```

## Optional API
```bash
cd backend
pip install -r requirements.txt
# MongoDB on localhost:27017
uvicorn server:app --reload --port 8001
```

Desktop MSI: https://github.com/barker6969/Aether6969/releases/tag/desktop-v0.1.0
