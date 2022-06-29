import {grayscale, PDFDocument, rgb} from 'pdf-lib'
import {PatternResult} from "../Flosser/patternSolver";
import {getImagePixel} from "../ImageProcessing";


export const exportPatternPdf = async (pattern: PatternResult) => {
    let image = pattern.image;

    // Create a map of color -> id
    let colorIdMap = new Map(pattern.flossUsage.map((s, i) => [s.spec.id, (i + 1).toString()]))

    // Build pdf and first page
    let pdfDoc = await PDFDocument.create()
    let patternPage = pdfDoc.addPage()

    // Calculate image scale
    let margin = 0.9

    let widthScale = (patternPage.getWidth() * margin) / image.width;
    let heightScale = (patternPage.getHeight() * margin) / image.height;

    let imageScale = Math.min(widthScale, heightScale)

    // Position image on page
    let pageXCenter = patternPage.getWidth() / 2;
    let pageYCenter = patternPage.getHeight() / 2;

    let imageXStart = pageXCenter - (image.width * imageScale) / 2
    let imageYStart = pageYCenter - (image.height * imageScale) / 2

    let imageXEnd = imageXStart + (image.width * imageScale);
    let imageYEnd = imageYStart + (image.height * imageScale);

    // Draw image
    for(let y = 0; y < image.height; y++) {
        for(let x = 0; x < image.width; x++) {
            let pixel = getImagePixel(image, x, y);
            patternPage.drawSquare({
                x: x*imageScale + imageXStart,
                y: imageYEnd - (y + 1)*imageScale,
                size: imageScale + 0.5,
                color: rgb(pixel.red/255, pixel.green/255, pixel.blue/255)
            })
        }
    }

    // Draw gridlines
    for (let x = 0; x < image.width + 1; x++) {
        patternPage.drawLine({
            start: { x: x * imageScale + imageXStart, y: imageYStart },
            end: { x: x * imageScale + imageXStart, y: imageYEnd },
            thickness: 1
        })
    }
    for (let y = 0; y < image.height + 1; y++) {
        patternPage.drawLine({
            start: { x: imageXStart, y: y * imageScale + imageYStart },
            end: { x: imageXEnd, y: y * imageScale + imageYStart },
            thickness: 1
        })
    }

    // Draw center lines
    patternPage.drawLine({
        start: { x: (imageXEnd - imageXStart) / 2 + imageXStart, y: imageYStart },
        end: { x: (imageXEnd - imageXStart) / 2 + imageXStart, y : imageYEnd },
        thickness: 1,
        color: rgb(1, 0, 0)
    })

    patternPage.drawLine({
        start: { x: imageXStart, y: (imageYEnd - imageYStart) / 2 + imageYStart },
        end: { x: imageXEnd, y : (imageYEnd - imageYStart) / 2 + imageYStart },
        thickness: 1,
        color: rgb(1, 0, 0)
    })


    let flossTablePage = await pdfDoc.addPage()

    let tableXStart = 25
    let tableXEnd = flossTablePage.getWidth() - 25

    let tableYStart = flossTablePage.getHeight() - 30
    let tableYEnd = tableYStart - (25 + pattern.flossUsage.length * 20)

    let curY = tableYStart - 20

    // Draw table borders
    flossTablePage.drawRectangle({x: tableXStart, y: tableYEnd,
        width: (tableXEnd - tableXStart), height: (tableYStart - tableYEnd),
        opacity: 1, borderOpacity: 1, borderColor: grayscale(0), borderWidth: 2})
    flossTablePage.drawLine({start: {x: 115, y: tableYStart}, end: {x: 115, y: tableYEnd}})
    flossTablePage.drawLine({start: {x: 365, y: tableYStart}, end: {x: 365, y: tableYEnd}})
    flossTablePage.drawLine({start: {x: 465, y: tableYStart}, end: {x: 465, y: tableYEnd}})

    // Write header
    flossTablePage.drawText("Color ID", {x: 30, y: curY, size: 16})
    flossTablePage.drawText("Name", {x: 120, y: curY, size: 16})
    flossTablePage.drawText("DMC ID", {x: 370, y: curY, size: 16})
    flossTablePage.drawText("Stitches", {x: 470, y: curY, size: 16})

    // Write entries and draw internal horizontal lines
    for(let flossUsage of pattern.flossUsage) {
        flossTablePage.drawLine({start: {x: tableXStart, y: curY - 5}, end: {x: tableXEnd, y: curY - 5}})
        curY -= 20

        flossTablePage.drawText(colorIdMap.get(flossUsage.spec.id) || '', {
            x: 30,
            y: curY,
            size: 14
        })
        flossTablePage.drawText(flossUsage.spec.name, {
            x: 120,
            y: curY,
            size: 14
        })
        flossTablePage.drawText(flossUsage.spec.id, {
            x: 370,
            y: curY,
            size: 14
        })
        flossTablePage.drawText(flossUsage.stitches.toString(), {
            x: 470,
            y: curY,
            size: 14
        })
    }


    let bwPatternPage = pdfDoc.addPage()

    // We can reuse the scale calculations from above

    // Write color labels
    let fontSize = imageScale / 2
    for(let y = 0; y < image.height; y++) {
        for(let x = 0; x < image.width; x++) {
            let spec = pattern.flossSpecs[x + y * image.width];
            bwPatternPage.drawText((colorIdMap.get(spec.id) || ''), {
                x: x*imageScale + imageXStart + 1,
                y: imageYEnd - (y + 1)*imageScale + 1,
                size: fontSize
            })
        }
    }

    // Draw gridlines
    for (let x = 0; x < image.width + 1; x++) {
        bwPatternPage.drawLine({
            start: { x: x * imageScale + imageXStart, y: imageYStart },
            end: { x: x * imageScale + imageXStart, y: imageYEnd },
            thickness: 1
        })
    }
    for (let y = 0; y < image.height + 1; y++) {
        bwPatternPage.drawLine({
            start: { x: imageXStart, y: y * imageScale + imageYStart },
            end: { x: imageXEnd, y: y * imageScale + imageYStart },
            thickness: 1
        })
    }

    // Draw center lines
    bwPatternPage.drawLine({
        start: { x: (imageXEnd - imageXStart) / 2 + imageXStart, y: imageYStart },
        end: { x: (imageXEnd - imageXStart) / 2 + imageXStart, y : imageYEnd },
        thickness: 1,
        color: rgb(1, 0, 0)
    })

    bwPatternPage.drawLine({
        start: { x: imageXStart, y: (imageYEnd - imageYStart) / 2 + imageYStart },
        end: { x: imageXEnd, y : (imageYEnd - imageYStart) / 2 + imageYStart },
        thickness: 1,
        color: rgb(1, 0, 0)
    })


    return pdfDoc.save()
}
