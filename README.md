# Learna

A proxy tool for jtgj365. ( Maybe support more platforms in future )

## Build

Build a binary exe file for win64 powered by pkg.

```
pnpm i && pnpm build
```

## Usage

Create a config file named `learna.config.json` under the same path with `learna.exe`

## Configuration

```ts
interface LearnaConfig {
  phone: string
  shopId: string
  captcha?: string
}
```