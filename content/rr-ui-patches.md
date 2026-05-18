# レトリワのUI補完システムが優秀すぎる件について
最終更新日: 2026年5月18日

## はじめに
このドキュメントは https://wiki.tockdom.com/wiki/Patches に掲載されているRetro RewindのUI関連のパッチについて、暫定的な情報をまとめたものです。最新の内容は上記URLを参照してください。

## 概要
`Patches`は、[patchzy](https://wiki.tockdom.com/wiki/Patchzy)氏が開発したファイルの上書きシステムです。このシステムでは、ゲーム内でユーザーが作成したファイルを読み込むことができます。ユーザーのファイルが存在しない場合は、パックに同梱されているファイルを読み込みます。

ざっといえば、My Stuffの上位互換のようなシステムです。現在の実装は、[LooseArchiveOverrides](https://github.com/Retro-Rewind-Team/rr-pulsar/blob/main/PulsarEngine/IO/LooseArchiveOverrides.cpp)及び[LooseBRSAROverrides](https://github.com/Retro-Rewind-Team/rr-pulsar/blob/main/PulsarEngine/Sound/LooseBRSAROverrides.cpp)からご確認いただけます。

### My Stuffと何が違うの
SZSファイルを例に挙げて考えてみましょう。例えば、`Race.szs`に含まれる順位画像をあなたが変えたとします。これまでの場合は、たった数ファイルの変更だったとしても`Race.szs`に圧縮してMy Stuffフォルダに入れていましたよね。

簡単に言えば、**圧縮の作業がRRでは不要になった**わけです。(圧縮自体はそこまで手間のかかる作業ではないのですが)

詳細は後で説明しますが、この仕様になると既存のUI補完ファイル(`UIAssets`など)とユーザーが作成した独自のファイルの共存がしやすくなります。

## `Patches`システムができること
このシステムでは、3種類のオーバーライド(上書き)に対応しています。
| 形式 | 概要 |
| --- | --- |
| ファイル単位のオーバーライド | ゲームが要求するファイルを外部の単体ファイル（ルースファイル）で置換 |
| `.szs`内サブファイルのオーバーライド | `.szs`の読み込み時に、内部ファイル(`.brlyt`や`.brctr`など)を単体ファイルで置換、追加、削除を行う |
| `revo_kart.brsar`内の音声ファイルのオーバーライド | `.brwsd`、`.brbnk`または`.brseq`形式の単体ファイルを使って、BRSAR内の特定のファイルIDを置換 |

また、パッキングされたModアーカイブにも対応しているようです。これは「Patches」フォルダ内に配置される通常のU8/SZSアーカイブであり、アーカイブ内の複数のパッチを一つのファイルにまとめて管理するために使用されます。

## ファイル単位のオーバーライド(完全な上書き)
ファイル全体を置き換える場合は、編集したファイルをパッチフォルダに配置し、上書きしたいファイルと全く同じ名前を付けてください。
いわば、従来のMy Stuffと同じ方法でファイルを配置することになります。

例は以下の通りです。
```
beginner_course.szs
n_Circuit32_n.brstm
n_Circuit32_f.brstm
```

ゲームが対象のファイルを読み込む場合、代わりにあなたのファイルが使用されます。

ファイル全体の上書きは、ベース名に基づいて行われます。つまり、`Patches/beginner_course.szs`は`/Race/Course/beginner_course.szs` を置き換えることになります。

これは、既に完全な`.szs`や`.brstm`などを直接置き換えたい場合に最適な置き換え形式です。
もっと言えば、コースの`.szs`ファイルや`.brstm`ファイルはこの形式で置き換えたほうがよいですね。

## アーカイブ内のファイルを置き換える(`.szs`内サブファイルのオーバーライド 置換編)
`.szs`ファイルに含まれる`.brlan`や`.brlyt`などは、こちらの方法で置き換えることができます。`Patches`内の各ファイルがターゲットアーカイブと照合され、そのアーカイブが読み込まれる際に挿入されます。

命名形式は以下の通りです。
```
[Folder1][Folder2]filename.originalFormat.ArchiveTag
```

| 名前 | 概要 |
| --- | --- |
| Folder1 | `.szs`直下のフォルダ名(`bg`, `button`, `control`など) |
| Folder2 | Folder1の中のフォルダ名(`anim`, `blyt`, `ctrl`, `timg`など) |
| filename | 置き換えるファイルの名前(`common_w004_menu`など) |
| originalFormat | 置き換えるファイルの拡張子(`.brlan`, `.brlyt`, `.brctr`, `.tpl`など) |
| ArchiveTag | 補完対象が含まれる`.szs`のファイル名(小文字でOK) |

アーカイブタグは、拡張子(`.szs`)を除いた対象のファイル名で、大文字と小文字は区別されません。たとえば、`MenuSingle.szs`は`menusingle`というタグを使用します。

### 例A:
```
common_w004_menu.brlyt.menusingle
```
このように記述すると、**MenuSingle.szs内のcommon_w004_menu.brlyt**を置き換えることができます。
実は、`Folder1`と`Folder2`は必須のタグではありません。指定がない場合、アーカイブ内に存在する対象のサブファイルをすべて置き換えます。

この例を基に話すと、置き換えられるサブファイルは
- MenuSingle.szs/button/blyt/common_w004_menu.brlyt
- MenuSingle.szs/message_window/blyt/common_w004_menu.brlyt

上記の２つになります。一気に置き換えることが目的であれば問題ないですが、意図しない変更を巻き起こす可能性もあります。

### 例B:
```
[button][blyt]common_w004_menu.brlyt.menusingle
```
このように記述すると、**MenuSingle.szs内のbutton/blyt/common_w004_menu.brlyt**を置き換えることができます。
例Aと違うのが、`Folder1`と`Folder2`の有無です。指定をすることで、置き換え対象のファイルを絞り込むことができます。

この例を基に話すと、置き換えられるサブファイルは
- MenuSingle.szs/button/blyt/common_w004_menu.brlyt

上記の１つだけになります。意図しない変更を巻き起こす問題はこちらのような記述で回避できます。

これはUI系の`.szs`ファイルに限定されるものではなく、内部ファイルパスとArchiveTag(ファイル名)が分かっていれば、どの`.szs`ファイルでも対象にすることができます。要するに、コース系の`.szs`ファイル内でもこの方法で置き換えることができます。

## アーカイブ内にファイルを追加・削除する(`.szs`内サブファイルのオーバーライド 追加・削除編)
このシステムは、.szsアーカイブに構造的な変更を加えることができます。つまり、既存のファイルを置き換えるだけでなく、アーカイブ内に新しいファイルを追加したり、既存のファイルを削除したりすることも可能です。

### ファイルの追加
ファイルを追加するには、以下の命名規則を使用します。
```
[Folder1][Folder2]filename.originalFormat.ArchiveTag
```

上記の命名規則のように、ファイルを追加するにはその親ディレクトリが既にアーカイブ内に存在しているパスを指定する必要があります。例えば、`MenuSingle.szs`内の`button/blyt`ディレクトリに新しいファイル`hogehoge.brlyt`を追加したい場合は、以下のように命名します。
```
[button][blyt]hogehoge.brlyt.menusingle
```

### ファイルの削除
ファイルを削除するには、以下の命名規則を使用します。
```
[Folder1][Folder2]filename.originalFormat.delete.ArchiveTag
```

上記の命名規則のように、ファイルを削除するには、削除したいファイルと同じ名前で、拡張子の前に`.delete`を追加して命名します。例えば、`MenuSingle.szs`内の`button/blyt/common_w004_menu.brlyt`を削除したい場合は、以下のように命名します。
```
[button][blyt]common_w004_menu.brlyt.delete.menusingle
```

フォルダのパスを指定しない場合、アーカイブ内のすべての同名ファイルが削除されます。例えば、以下のように命名すると、`MenuSingle.szs`内の`button/blyt/common_w004_menu.brlyt`と`message_window/blyt/common_w004_menu.brlyt`の両方が削除されます。
```
common_w004_menu.brlyt.delete.menusingle
```

> 構造的な変更を行う場合、メモリ上でアーカイブを再構築する必要があるため、単純な置換(完全な上書き形式)よりも負荷が高くなります。