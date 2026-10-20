# Espresso Blok — Mobil Uygulama Projesi

Bu klasör, Espresso Blok oyununu **Capacitor** ile sarmalanmış, Android ve iOS
için hazır bir native uygulama proje iskeletidir. Oyunun kendisi
`www/index.html` içinde tek dosya halinde duruyor; Capacitor bunu bir
WebView içinde native bir uygulama olarak çalıştırıyor.

**Önemli:** Burada (Claude'un bulut ortamında) Android SDK ve Xcode
bulunmadığı, ayrıca Google/Apple'ın derleme sunucularına ağ erişimi
olmadığı için mağazaya yüklenebilecek **imzalı bir .aab/.ipa dosyasını bu
ortamda üretemedim**. Proje tamamen hazır ve çalışır durumda — geri kalan
adımlar kendi bilgisayarında (Android için herhangi bir işletim sistemi,
iOS için mutlaka bir Mac) yapılıyor.

## İçerik

- `www/index.html` — oyunun tamamı (HTML/CSS/JS, tek dosya)
- `android/` — tam bir Android Studio projesi
- `ios/` — tam bir Xcode projesi
- `capacitor.config.json` — uygulama kimliği, adı, renkleri
- Uygulama ikonu zaten her iki platform için de oluşturuldu (kahve
  fincanı + bloklar motifi) — mağazaya çıkmadan önce profesyonel bir
  ikonla değiştirmeni öneririm.

## Android — APK/AAB üretip Play Store'a koyma

1. [Android Studio](https://developer.android.com/studio) kur (ücretsiz).
2. Android Studio'da **Open** diyerek bu klasördeki `android/` klasörünü aç.
   İlk açılışta Gradle senkronizasyonu için internet gerekir (birkaç dakika
   sürebilir, eksik SDK bileşenlerini kendisi indirir).
3. Üstteki menüden **Build → Generate Signed Bundle / APK** seç.
   - **Android App Bundle (.aab)** seçeneğini seç (Play Store artık bunu istiyor).
   - "Create new..." ile bir **keystore** (imzalama anahtarı) oluştur. Bu
     dosyayı ve şifrelerini kaybetmemen çok önemli — uygulamanın gelecekteki
     tüm güncellemeleri aynı anahtarla imzalanmak zorunda.
4. Oluşan `.aab` dosyasını [Google Play Console](https://play.google.com/console)
   üzerinden yeni bir uygulama olarak yükle.
   - Play Console'a kayıt tek seferlik **25 USD** geliştirici ücreti ister.
   - Mağaza listelemesi için ekran görüntüleri, kısa/uzun açıklama,
     gizlilik politikası linki ve bir öne çıkan görsel istenecek.
5. `android/app/build.gradle` içindeki `applicationId` şu an
   `com.espressoblok.app` — istersen kendi paket adınla değiştir (yayınladıktan
   sonra bu değer bir daha değiştirilemez).
6. Uygulama adı ve sürüm numarası: `android/app/build.gradle`
   (`versionCode`, `versionName`) ve `capacitor.config.json` (`appName`).

### Hızlı test (mağazaya yüklemeden telefonunda denemek için)
Android Studio'da **Run** tuşuna basarak USB ile bağlı bir Android
telefonda veya emülatörde uygulamayı doğrudan çalıştırabilirsin — imzalama
veya Play Console gerekmez.

## iOS — App Store'a koyma

iOS tarafı **mutlaka bir Mac** gerektirir (Xcode sadece macOS'ta çalışır).

1. Mac'te Xcode'u App Store'dan kur (ücretsiz).
2. `ios/App/App.xcworkspace` dosyasını Xcode ile aç (`.xcodeproj` değil,
   `.xcworkspace` dosyasını aç).
3. [Apple Developer Program](https://developer.apple.com/programs/)'a üye ol
   (yıllık **99 USD**).
4. Xcode'da proje ayarlarından **Signing & Capabilities** sekmesinde kendi
   Apple Developer hesabını seç; Bundle Identifier'ı (şu an
   `com.espressoblok.app`) kendi hesabınla eşleşecek şekilde ayarla.
5. Üst menüden **Product → Archive** ile bir arşiv oluştur, ardından
   **Distribute App → App Store Connect** ile yükle.
6. [App Store Connect](https://appstoreconnect.apple.com) üzerinden
   uygulama bilgilerini (açıklama, ekran görüntüleri, gizlilik politikası)
   doldurup incelemeye gönder.

## Oyunu güncellersen

Espresso Blok'un web/artifact sürümünde (Claude üzerinde) bir değişiklik
yaptığında, güncellenmiş `index.html` dosyasını buradaki `www/index.html`
ile değiştirip şu komutu çalıştırman yeterli — Android/iOS projeleri
otomatik güncellenir:

```
npx cap copy
```

(İlk kullanımdan önce bu klasörde `npm install` çalıştırman gerekir —
`node_modules` boyut nedeniyle pakete dahil edilmedi.)

## Not: Gizlilik politikası

Hem Play Store hem App Store, oyun içinde **localStorage** kullanarak
skor/rozet/kayıtlı tarif sakladığı için (hiçbir veri sunucuya
gönderilmiyor, her şey cihazda kalıyor) basit bir gizlilik politikası
metni istenecek. "Bu uygulama hiçbir kişisel veri toplamaz veya üçüncü
taraflarla paylaşmaz; ilerleme bilgisi yalnızca cihazınızda saklanır"
şeklinde tek sayfalık bir metin (örneğin ücretsiz bir Google Sites
sayfasında) genelde yeterli oluyor.
