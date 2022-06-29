import {grayscale, PDFDocument, rgb} from 'pdf-lib'
import {PatternResult} from "../Flosser/patternSolver";
import {getImagePixel} from "../ImageProcessing";


export const exportPatternPdf = async (pattern: PatternResult) => {
    let image = pattern.image;

    let pdfDoc = await PDFDocument.create()
    let patternPage = pdfDoc.addPage()

    let margin = 0.9

    let widthScale = (patternPage.getWidth() * margin) / image.width;
    let heightScale = (patternPage.getHeight() * margin) / image.height;

    let imageScale = Math.min(widthScale, heightScale)

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
    flossTablePage.drawLine({start: {x: 365, y: tableYStart}, end: {x: 365, y: tableYEnd}})
    flossTablePage.drawLine({start: {x: 465, y: tableYStart}, end: {x: 465, y: tableYEnd}})

    // Write header
    flossTablePage.drawText("Name", {x: 30, y: curY, size: 16})
    flossTablePage.drawText("DMC ID", {x: 370, y: curY, size: 16})
    flossTablePage.drawText("Stitches", {x: 470, y: curY, size: 16})

    // Write entries and draw internal horizontal lines
    for(let flossUsage of pattern.flossUsage) {
        flossTablePage.drawLine({start: {x: tableXStart, y: curY - 5}, end: {x: tableXEnd, y: curY - 5}})
        curY -= 20

        flossTablePage.drawText(flossUsage.spec.name, {
            x: 30,
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


    return pdfDoc.save()
}
