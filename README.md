# Nature Log

## Description

[Nature Remo](https://nature.global/nature-remo/) を利用して、室温と湿度のログを記録、閲覧するアプリケーションです。

- iOS & Android Apps: React Native + Expo
- Logging & Authentication: Firebase(Firestore, Functions, Authentication)

## Tech Stack

- App: React Native + Expo
- API: [Nature Remo Cloud API](https://developer.nature.global/)
- Logging: Firebase Functions + Firebase Firestore
- Authentication: Firebase Authentication

## Usage

自室の気温のログというプライベートな情報を扱うため、自分の Firebase プロジェクトを作成して記録していく形式としています。

### アプリケーションソースの Clone

```shell
git clone git@github.com:schwarz9791/nature-log.git
```

### モジュールインストール

```shell
npm install
```

### Nature Remo Cloud API Access Token

- [Nature API のアクセストークン発行ページ](https://home.nature.global/) にログインし、アクセストークンを発行する

### Firebase

- [Firebase コンソール](https://console.firebase.google.com/) にアクセスし、新規プロジェクトを作成
- プロジェクトの設定で iOS/Android/Web アプリを追加
  - iOS: バンドル ID を入力して、 `GoogleService-Info.plist` をダウンロード。プロジェクトのルートディレクトリに保存
  - Android: パッケージ名を入力して、 `google-services.json` をダウンロード。プロジェクトのルートディレクトリに保存
  - Web: ニックネームを入力して、 初期化用のコンフィグ（`apiKey`, `authDomain` など）の値を記録
- `.env.default` を複製して `.env` を作成
  - 各環境変数の右辺に Firebase プロジェクトの Web アプリ作成時に記録した初期化用コンフィグの値を記入

### Firebase Authentication

- サイドバーの `構築` から `Authentication` を選択
- `始める` をクリック
- ログインプロバイダから `メール/パスワード` を選択し、有効にする
- `Users` タブでユーザーの手動追加をする

### Nature Remo のデバイス ID の取得

アプライアンス API を `curl` などで叩き、ログを記録したいエアコンが登録されている Nature Remo のデバイス ID を特定します

```shell
curl -X GET "https://api.nature.global/1/appliances" -H "accept: application/json" -H "Authorization: Bearer ${YOUR_NATURE_API_ACCESS_TOKEN}" | jq '[.[] | { id: .device.id, name: .device.name, type: .type }]' | jq 'map(select( .type == "AC" ))'
```

### Firebase

#### `firebase-cli` のインストール

```shell
npm i -g firebase-tools
```

#### Firebase にログイン

```shell
firebase login
```

#### Firebase の初期化

```shell
firebase init
```

- 上記を実行し、 `Firestore` と `Functions` にチェックして `<enter>`
- `Use an existing project` を選択し、作成済みの Firebase プロジェクトを選択
- ルール `firestore.rules` やインデックス `firestore.indexes.json` は上書きしない
- 以降の設問には下記で入力

```shell
=== Functions Setup

Detected existing codebase(s): default

? Would you like to initialize a new codebase, or overwrite an existing one? Overwrite

Overwriting codebase default...

? What language would you like to use to write Cloud Functions? TypeScript
? Do you want to use ESLint to catch probable bugs and enforce style? Yes
? File functions/package.json already exists. Overwrite? No
i  Skipping write of functions/package.json
? File functions/.eslintrc.js already exists. Overwrite? No
i  Skipping write of functions/.eslintrc.js
? File functions/tsconfig.json already exists. Overwrite? No
i  Skipping write of functions/tsconfig.json
? File functions/tsconfig.dev.json already exists. Overwrite? No
i  Skipping write of functions/tsconfig.dev.json
? File functions/src/index.ts already exists. Overwrite? No
i  Skipping write of functions/src/index.ts
? File functions/.gitignore already exists. Overwrite? No
i  Skipping write of functions/.gitignore
? Do you want to install dependencies with npm now? Yes
```

#### Firestore のセキュリティルールのデプロイ

```shell
firebase deploy --only firestore:rules
```

#### Firestore に初期データを準備

- Firebase コンソールのサイドバーの `構築` から `Firestore Database` を選択
- `+コレクションを開始` をクリックし、 `settings` コレクションを作成
  - ドキュメント ID は自動 ID で生成し、 `target_device_id` というフィールドを `string` で作成、値に上記で取得したデバイス ID を入力
  - 自動 ID で生成したドキュメント ID はコピーしておく（`YOUR_SETTINGS_DOCUMENT_ID`）

#### Functions のコンフィグ設定

```shell
firebase functions:config:set nature_remo.access_token={YOUR_NATURE_API_ACCESS_TOKEN}
firebase functions:config:set user.settings_key={YOUR_SETTINGS_DOCUMENT_ID}
```

#### Functions のデプロイ

Blaze プランである必要があります

```shell
firebase deploy --only functions
```

Firebase コンソールの `構築` から `Functions` を選択し、関数がデプロイされているのを確認

### Expo

[Expo](https://expo.dev)にすでにあるアカウントでログインするか、新たにサインアップする

#### プロジェクト作成

- サインアップ完了後のダッシュボードで `Create a project` の `Get Started` を選択
- プロジェクト名と Slug を入力して先に進む

#### `eas-cli` のインストール

```shell
npm i -g eas-cli
```

#### EAS にログイン

```shell
eas account:login
```

#### EAS の初期化

```shell
eas init
```

`app.config.js` に設定されている値と違う、というエラーが出るので、 `owner`, `slug`, `extra.eas.projectId`, `updates.url` 作成した Expo プロジェクトのものに書き換え

#### EAS の環境変数を設定

```shell
eas secret:push --scope project --env-file ./.env
```

#### EAS にアップロード

```shell
eas update
```

#### dev-client のビルド

EAS でのビルドには各環境の開発者アカウントが必要です（[iOS](https://developer.apple.com/jp/programs/) / [Android](https://developer.android.com/distribute/console?hl=ja)）

##### シミュレーター用ビルドの作成とインストール

```shell
eas build --profile simulator --platform ios
```

##### 実機用ビルドの作成とインストール

iOS の場合、端末のデベロッパーモードを有効にし、構成プロファイルをインストールする必要があります

```shell
eas build --profile development --platform ios
```

#### Metro bundler で DevClient 用のコードとアセットを配信

DevClient でビルドされたアプリケーションの動作確認の際は、変更されたソースコードのライブリロードなどが行われるため、ローカルの開発環境で Expo(Metro bundler) が DevClient モードで動作している必要があります

```shell
npx expo --dev-client
```

#### プレビュービルドの作成とインストール

開発環境を起動しなくてもチェックできるように、プレビュービルドを作成して実機にインストール

```shell
eas build --profile preview --platform ios
```
