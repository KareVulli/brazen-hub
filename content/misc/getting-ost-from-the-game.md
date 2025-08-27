
# Listening to Audio files from the game

MD has not uploaded Brazen Blaze soundtrack to YouTube or anywhere else. Brazen Blaze uses CRI ADX Audio middleware and its files cannot be opened with just any audio player, as they are encoded in a proprietary format. Here is a small guide on how to listen to the soundtrack outside of the game. This guide assumes you have a PC running Windows with Brazen Blaze downloaded from Steam.

Do this at your own risk. I am not responsible for breaking your system.

## Required software

* foobar2000 audio player: https://www.foobar2000.org/
* vgmstream component for foobar2000: https://vgmstream.org/

## Setting up foobar2000

1. Run foobar2000.
2. Go to **File** -> **Preferences** -> **Components**.
3. Click **Install...** and select the downloaded `foo_input_vgmstream.fb2k-component`
4. Some Brazen Blaze audio files have a lot of channels which can cause problems when converting the audio to mp3 and other formats. To lower the number of channels, it is possible to configure vgmstream to downmix to a lower number of channels. Go to **File** -> **Preferences** -> **Playback** -> **Decoding** -> **vgmstream**. In this view enter the number of channels to "Downmix" field that you want to have. I have used 6 channels for okay results. It is worth noting that it is not going to be accurate and can mess up the mixing of different channels.

## Finding the audio files

CRI ADX Audio files end with `.acb` files extension. In brazen blaze, they are located in `brazenblaze_Data\StreamingAssets\adx2` subfolders. For example, background music is located in `brazenblaze_Data\StreamingAssets\adx2\bgm` folder.

To locate your game files, go to Steam, Right click on Brazen Blaze in library and select **Manage** -> **Browse local files**.

## Open an audio file

To open one of the audio files, Open foobar2000 and either use **File** -> **Open...** or just drag and drop an `.acb` file to the playlist area.

One `.acb` file may contain multiple tracks inside it. Some tracks are split up into multiple subtracks.

## Saving an audio file as .wav

To make the audio file playable with your preferred audio player, you can convert the tracks to a more standard audio format.

In playlist, select all the tracks you want to convert, right click on them and select **Convert** -> **[default]** or **Convert** -> **...** if you want to customize the conversion process.

## Background music

The following files contain the Background music from the lobby. Some other files contain duplicates. But also feel free to check out other files in the `bgm` folder to find character selection and in game music. Those do tend to be split up to many small tracks, though.

* bgm@s013_85b2_bgm_lobby_s011_en.acb - Closet
* bgm@s013_4a6b_bgm_lobby_s011_ja.acb - Theme song and the invincibility item I guess?
* bgm@s013_ad0d_bgm_lobby_s013_en.acb - Lobby
* bgm@s013_9740_bgm_lobby_s013_ja.acb - Lobby with vocals
* bgm@s013_3462_bgm_lobby_s000_en.acb - Beta lobby
* bgm@s013_feda_bgm_lobby_s000_ja.acb - Beta lobby with vocals
* bgm@s023_be4c_bgm_lobby_s023_en.acb
  * bgm@s023_be4c_bgm_lobby_s023_en#4 - Christmas Closet I think?
  * bgm@s013_ad0d_bgm_lobby_s023_en#5 - Christmas Lobby

These descriptions are probably not accurate.

It's kinda odd that the English version of the tracks don't have vocals, even though the vocals are in English.

The files and names may change as the game gets updated. These we're checked with game version 2.1.0




