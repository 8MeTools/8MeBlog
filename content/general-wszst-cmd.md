# Wiimms SZS Tools 基本コマンド集
最終更新日: 2025年9月7日


## 注意
- 以下のコマンドに含まれる`hogehoge`は任意の名前に変更してください。
- CT作成に関連した操作については[Caronさんの記事](https://wiki.tockdom.com/wiki/User:Caron/CTTutorial_Japanese)をご覧ください。
- `wstrt`などの操作については[こちら](https://mariokartwii.com/showthread.php?pid=14)をご確認ください。

## wszst編
- アセットファイルの展開
```
wszst x hogehoge.szs
```
上のように入力すると`hogehoge.d`フォルダが作成されます。
- アセットファイルの圧縮(SZS化)
```
wszst c hogehoge.d
```
以下のように`-o`をつけることで、上書きでアセットファイルを圧縮できます。
```
wszst c hogehoge.d -o
```
## wimgt編
- tplファイルをpngに変換
```
wimgt decode hogehoge.tpl
```
- pngをtplファイルに変換
```
wimgt encode hogehoge.png -o
```
## wbmgt編
- BMGをテキストに変換
```
wbmgt decode hogehoge.bmg
```
- テキストをBMGに変換
```
wbmgt encode hogehoge.txt -o
```

## 複数のファイルに対して一括で同じ操作を行う
数多くのCLIツールでサポートされているように、`wszst`でもワイルドカード(`*`)が使用できます。
例えば1つのフォルダに複数の`szs`があるとき、一括で展開させるには以下のようにコマンドを実行します。
```
wszst x *.szs
```
もちろん、`szs`の展開以外でも同様に操作が可能です。

## 特定のディレクトリ(フォルダ)で操作を行う
デスクトップにファイルを移して、`cd desktop`を叩いてから操作をしている方におすすめです。
こちらの記事をご覧ください(別サイトに遷移します。)
https://qiita.com/yo-nagase/items/2ac133a244f4a9527022