# My-Webapp-Boilerplate

TypeScript, Webpack4, React

- TypeScript with latest ECMA Script standard
- Dynamic import and code splitting
- Bundle analyze can be displayed visually
- Output files and assets have hashed file name
- implemented runtime performance analyzer (on-going)
- One webpack.config.js for all mode

todo:
- support SASS
- PWA
- different build (electron maybe?)
- make faster build (happypack or thread-loader)

## Development
`npm run dev` and go to: http://localhost:3000

## Production build
`npm run build`
or `export BASE_URL=/app && npm run build` to override base URL.

## Electron
`npm run electron`