# lol

generates pairs for 1on1

## Getting Started

### Installing

```console
yarn global add @farmnote-holdings/lol
# or
npm install --global @farmnote-holdings/lol
```

### Generating 1on1 Pairs

Generate pairs with a file has members attributes.

```console
lol generate sample/members-attrs.yml > pairs.json
```

With histories, use `-h` / `--histories-path` option.

```console
lol generate -h sample/histories.yml sample/members-attrs.yml > pairs.json
```

### Printing CSV

```console
lol csv pairs.json
```

## Evaluating Pairs By Calculating Score

```console
lol score pairs.json
```
