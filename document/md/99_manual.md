# 競技マニュアル
## 競技の開始
このリポジトリをチームの代表者1名のGithubアカウントのpublicリポジトリにforkしてください。

配布された秘密鍵のアクセス権限を適切に設定してください
```
$ chmod 400 {秘密鍵のパス}
```

配布された環境IDおよび秘密鍵を使って、環境にログインしてください。
```
$ ssh -i {秘密鍵ファイルのパス} azureuser@{環境ID}.ftt2204.dabaas.net
```

rootユーザに切り替えて、ホームディレクトリに移動してください。
```
$ sudo su -
$ cd
```

terminalに表示されるホスト名が環境IDになっていることを確認してください
```
root@{環境ID}:~#
```

ホームディレクトリにある「entry.sh」を実行し、forkしたリポジトリのURLを入力、実行してください。
```
$ bash entry.sh
forkしたリポジトリのURLを入力ください: https://github.com/your-name/42HoursTurningTheBackend.git
```

リポジトリがcloneされるので、チューニングしたコードの実行、採点を行ってください。

## スクリプトの紹介
競技に必要、または利用できそうなスクリプトを用意しています。それぞれの概要を説明します。

注意:
- すべて、スクリプト配置フォルダ内で直接実行してください。
- ファイルを削除するスクリプトが含まれます。実行環境にお気をつけください。

### ビルド
場所: ```develompent/```

```development/```の現在の内容でイメージおよびコンテナを作成し、サービスを立ち上げます。古いイメージは削除されます。
```
$ bash build.sh
```

### 評価
場所: ```scoring/```

現在起動しているサービスに対し、採点を行います。実行には数分かかります。
```
$ bash evaluate.sh
```

### 負荷試験
場所: ```develompent/```

データのリストアとAPIテストを省略し、採点時と同様のシナリオで負荷試験を行います。評価スクリプトより早く実行できます。
```
$ bash stressOnly.sh
```

### APIテスト
場所: ```develompent/```

採点時に実施されるAPIテストを制約付きで実行できます。

制約及び注意:
- データのリストアを省略するため、評価スクリプトより早く実行できます。
- 一部の項目はスキップされます。
- 初期データに含まれるテスト用のデータが利用できなかった場合、テストは失敗します
- 評価スクリプトとは異なり、http://127.0.0.1:8080/宛にテストを実施します。
- このスクリプトの結果はOKだが採点スクリプトではテスト結果がNGの場合、後者が優先されます。


```
$ bash apiTestOnly.sh
```

### リストア
場所: ```develompent/```

採点時に実施されるデータリストアのみを行います。簡易DBマイグレーションも実施されます。

実行には数分かかります。

```
$ bash restoreOnly.sh
```

## 簡易DBマイグレーション機能
評価スクリプトを実行する度にデータベースの状態は戻ってしまいますが、あらかじめ登録されたSQLを実行させ、テーブル等への変更を採点前に反映させることができます。

```development/```ディレクトリの```mysql/sql/```に置かれた.sqlファイルは、採点前に実行されます。
V1.sql,V2.sql...という名称のファイルを置いておくことで、番号が若い順に実行されていきます。V0.sqlは、既に実行されたものとします。

## 競技環境に関する注意
- 競技環境のHDDの容量はそこまで潤沢ではありません。不要なリソースは削除するようにしてください。
- ディレクトリ構成を変えないようにしてください。スクリプトが動作しなくなる場合があります。
- このリポジトリは現在、ローカル環境での実行を想定していません。
- ```/da```領域は変更しないでください。動作しなくなる場合があります。また、中身の持ち出しも禁止です。


## FAQ
- Q. ローカル環境で開発してもいいですか？
  - レギュレーション違反ではありませんが、現在サポートしていません。ローカルでは正常に動かないスクリプトがあります。
  - ファイルやディレクトリを削除するスクリプトもあるので、ローカルで実行する場合は注意してください。
- Q. 何もしていないのに、スコアが下がる
  - 負荷試験の性質上、同一条件でも採点結果が多少上下します。
  - ある改善前後でスコアが下がっても、効果が全くなかったと断定できない場合があります。
- Q. データの整合性はどこまで気をつければいいですか。アプリが実行中にクラッシュしたシナリオの対応など。
  - 最低限APIテストが通るレベルにしておいてください。
- Q. 画像の圧縮や変換はどこまで認められますか？
  - A. UI上で目視し、サービスとして機能しているところまでok。
- Q. データベースのテーブルの構造を変更しても良いですか？
  - A. OKです。
- Q. ライブラリやツールをVMにインストールしても構いませんか？
  - A. OKです。
- Q. 追加でVMのファイアウォールのポートを開放できますか？
  - A. できません。HTTPS,SSHのみの開放です。
- Q. nginxやmysqlを別のものに変更したり、backendを別の言語で実装しても良いですか？
  - A. OKです。

## その他
サービスの動作を簡単に把握したい場合は、[こちらの](https://empty.ftt2204.dabaas.net)登録データなし環境を使ってみてください。