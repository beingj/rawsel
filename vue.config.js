module.exports = {
    "transpileDependencies": [
        "vuetify"
    ],
    "outputDir": "docs",
    "publicPath": process.env.NODE_ENV === 'production'
        ? '/rawsel/'
        : '/',
    pages: {
        index: {
            entry: 'src/main.ts',
            title: 'Raw SEL Viewer'
        }
    }
    // "parallel": 2 // not work
}