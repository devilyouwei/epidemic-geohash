# Geohash temporary document for paper exchange

## GeoHash bit explanation

Geobit is divided into two parts, the first half part encodes longitude, the second half part encodes the latitude.

## Block Storage

We store all these blocks and user data in common databases on the server. Considering that in the real engineering
environment, data storage includes two parts:

-   user geographic location data
-   block data

Logically speaking, one block contains many users, and one user has many position logs. Block and user information are
bidirectional associated, which is called “many to many” in the field of computer storage. This section will discuss the
stored data models and algorithms.

### Position to GeoHash Bit

Before storing the block, we have to first encode the position by GeoHash. Referring to the method of grid division in
Section 4.1, we adopt the following algorithm.

```js
function geohash(latitude, longitude, bit) {
    let res = ''
    var lat = []
    var lon = []

    // limitation of longitude and latitude
    lat[0] = -90.0
    lat[1] = 90.0
    lon[0] = -180.0
    lon[1] = 180.0

    if (latitude < lat[0] || latitude > lat[1] || longitude < lon[0] || longitude > lon[1])
        throw new Error('Invalid longitude or latitude')

    let len = bit * 2
    while (res.length < len) {
        // add longitude geohash bit
        let mid = (lon[0] + lon[1]) / 2
        if (mid > longitude) {
            res += '0'
            lon[1] = mid
        } else {
            res += '1'
            lon[0] = mid
        }
        // add latitude geohash bit
        mid = (lat[0] + lat[1]) / 2
        if (mid > latitude) {
            res += '0'
            lat[1] = mid
        } else {
            res += '1'
            lat[0] = mid
        }
    }
    return res
}
```

### GeoHash Bit to Hex

If we directly save the binary code of a block, a string of binary code is too long. In the actual database, we convert
binary to hexadecimal and store the hex code in **Redis**. Therefore, a string of hex code represents one block, and
also represents a range of positions. The following figure is the process of "from position to hex code".

![Block Storage](./block-storage.png)

The advantage of using hexadecimal coding is that when the position needs to be determined, it can be restored to
binary, and then to a range of latitude and longitude. The accuracy of the restored position depends on the number of
bits in the geohash. In this project, we use 10-20 bit GeoHash to encode longitude and latitude respectively, so the
total length of the generated GeoHash binary is 20-40 bits. In the practical test, we consider that the block size in
such range is the most suitable for the medical worker to observe.
