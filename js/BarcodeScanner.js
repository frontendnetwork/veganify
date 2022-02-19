/**
 * CallBacks:
 * __________________________________________________________________________________
 * All the callback function should have one parameter:
 * function(result){};
 * And the result parameter will contain an array of objects that look like BarcodeScanner.
 * result = [{Format: the barcode type, Value: the value of the barcode}];
 * __________________________________________________________________________________
 * 
 * You can use either the set functions or just access the properties directly to set callback or 
 * other properties. Just always remember to call Init() before starting to decode something never mess
 * around with the SupportedFormats property.
 * 
 */
BarcodeScanner = {
	Config : {
		// Set to false if the decoder should look for one barcode and then stop. Increases performance.
		Multiple : true,
		
		// The formats that the decoder will look for.
		DecodeFormats : ["Code128","Code93","Code39","EAN-13", "2Of5", "Inter2Of5", "Codabar"],
		
		// ForceUnique just must makes sure that the callback function isn't repeatedly called
		// with the same barcode. Especially in the case of a video stream.
		ForceUnique: true,
		
		// Set to true if information about the localization should be recieved from the worker.
		LocalizationFeedback: false,
		
		// Set to true if checking orientation of the image should be skipped.
		// Checking orientation takes a bit of time for larger images, so if
		// you are sure that the image orientation is 1 you should skip it.
		SkipOrientation : false
	},
	SupportedFormats : ["Code128","Code93","Code39","EAN-13", "2Of5", "Inter2Of5", "Codabar"],// Don't touch.
	ScanCanvas : null, // Don't touch the canvas either.
	ScanContext : null,
	SquashCanvas : document.createElement("canvas"),
	ImageCallback : null, // Callback for the decoding of an image.
	streamCallback : null, // Callback for the decoding of a video.
	LocalizationCallback : null, // Callback for localization.
	Stream : null, // The actual video.
	DecodeStreamActive : false, // Will be set to false when StopStreamDecode() is called.
	Decoded : [], // Used to enfore the ForceUnique property.
	DecoderWorker : new Worker("../js/DecoderWorker.js"),
	OrientationCallback : null,
	// Always call the Init().
	init : function() {
		BarcodeScanner.ScanCanvas = BarcodeScanner.FixCanvas(document.createElement("canvas"));
		BarcodeScanner.ScanCanvas.width = 640;
		BarcodeScanner.ScanCanvas.height = 480;
		BarcodeScanner.ScanContext = BarcodeScanner.ScanCanvas.getContext("2d");
	},
	
	// Value should be true or false.
	SetRotationSkip : function(value) {
		BarcodeScanner.Config.SkipOrientation = value;
	},
	// Sets the callback function for the image decoding.
	SetImageCallback : function(callBack) {
		BarcodeScanner.ImageCallback = callBack;
	},
	
	// Sets the callback function for the video decoding.
	setStreamCallback : function(callBack) {
		BarcodeScanner.streamCallback = callBack;
	},
	
	// Sets callback for localization, the callback function should take one argument.
	// This will be an array with objects with format.
	// {x, y, width, height}
	// This represents a localization rectangle.
	// The rectangle comes from a 320, 240 area i.e the search canvas.
	SetLocalizationCallback : function(callBack) {
		BarcodeScanner.LocalizationCallback = callBack;
		BarcodeScanner.Config.LocalizationFeedback = true;
	},
	
	// Set to true if LocalizationCallback is set and you would like to
	// receive the feedback or false if 
	SwitchLocalizationFeedback : function(bool) {
		BarcodeScanner.Config.LocalizationFeedback = bool;
	},
	
	// Switches for changing the Multiple property.
	DecodeSingleBarcode : function() {
		BarcodeScanner.Config.Multiple = false;
	},
	DecodeMultiple : function() {
		BarcodeScanner.Config.Multiple = true;
	},
	
	// Sets the formats to decode, formats should be an array of a subset of the supported formats.
	SetDecodeFormats : function(formats) {
		BarcodeScanner.Config.DecodeFormats = [];
		for(var i = 0; i < formats.length; i++) {
			if(BarcodeScanner.SupportedFormats.indexOf(formats[i]) != -1) {
				BarcodeScanner.Config.DecodeFormats.push(formats[i]);
			}
		}
		if(BarcodeScanner.Config.DecodeFormats.length == 0) {
			BarcodeScanner.Config.DecodeFormats = BarcodeScanner.SupportedFormats.slice();
		}
	},
	
	// Removes a list of formats from the formats to decode.
	SkipFormats : function(formats) {
		for(var i = 0; i < formats.length; i++) {
			var index = BarcodeScanner.Config.DecodeFormats.indexOf(formats[i]);
			if(index >= 0) {
				BarcodeScanner.Config.DecodeFormats.splice(index,1);
			}
		}
	},
	
	// Adds a list of formats to the formats to decode.
	AddFormats : function(formats) {
		for(var i = 0; i < formats.length; i++) {
			if(BarcodeScanner.SupportedFormats.indexOf(formats[i]) != -1) {
				if(BarcodeScanner.Config.DecodeFormats.indexOf(formats[i]) == -1) {
					BarcodeScanner.Config.DecodeFormats.push(formats[i]);
				}
			}
		}
	},
	
	// The callback function for image decoding used internally by BarcodeScanner.
	BarcodeScannerImageCallback : function(e) {
		if(e.data.success == "localization") {
			if(BarcodeScanner.Config.LocalizationFeedback) {
				BarcodeScanner.LocalizationCallback(e.data.result);
			}
			return;
		}
		if(e.data.success == "orientationData") {
			BarcodeScanner.OrientationCallback(e.data.result);
			return;
		}
		var filteredData = [];
		for(var i = 0; i < e.data.result.length; i++) {
			if(BarcodeScanner.Decoded.indexOf(e.data.result[i].Value) == -1 || BarcodeScanner.Config.ForceUnique == false) {
				filteredData.push(e.data.result[i]);
				if(BarcodeScanner.Config.ForceUnique) BarcodeScanner.Decoded.push(e.data.result[i].Value);
			}
		}
		BarcodeScanner.ImageCallback(filteredData);
		BarcodeScanner.Decoded = [];
	},
	
	// The callback function for stream decoding used internally by BarcodeScanner.
	BarcodeScannerStreamCallback : function(e) {
		if(e.data.success == "localization") {
			if(BarcodeScanner.Config.LocalizationFeedback) {
				BarcodeScanner.LocalizationCallback(e.data.result);
			}
			return;
		}
		if(e.data.success && BarcodeScanner.DecodeStreamActive) {
			var filteredData = [];
			for(var i = 0; i < e.data.result.length; i++) {
				if(BarcodeScanner.Decoded.indexOf(e.data.result[i].Value) == -1 || BarcodeScanner.ForceUnique == false) {
					filteredData.push(e.data.result[i]);
					if(BarcodeScanner.ForceUnique) BarcodeScanner.Decoded.push(e.data.result[i].Value);
				}
			}
			if(filteredData.length > 0) {
				BarcodeScanner.streamCallback(filteredData);
			}
		}
		if(BarcodeScanner.DecodeStreamActive) {
			BarcodeScanner.ScanContext.drawImage(BarcodeScanner.Stream,0,0,BarcodeScanner.ScanCanvas.width,BarcodeScanner.ScanCanvas.height);
			BarcodeScanner.DecoderWorker.postMessage({
				scan : BarcodeScanner.ScanContext.getImageData(0,0,BarcodeScanner.ScanCanvas.width,BarcodeScanner.ScanCanvas.height).data,
				scanWidth : BarcodeScanner.ScanCanvas.width,
				scanHeight : BarcodeScanner.ScanCanvas.height,
				multiple : BarcodeScanner.Config.Multiple,
				decodeFormats : BarcodeScanner.Config.DecodeFormats,
				cmd : "normal",
				rotation : 1,
			});
		
		}
		if(!BarcodeScanner.DecodeStreamActive) {
			BarcodeScanner.Decoded = [];
		}
	},
	
	// The image decoding function, image is a data source for an image or an image element.
	DecodeImage : function(image) {
		if(image instanceof Image || image instanceof HTMLImageElement)
		{
			image.exifdata = false;
			if(image.complete) {
				if(BarcodeScanner.Config.SkipOrientation) {
					BarcodeScanner.BarcodeScannerDecodeImage(image,1,"");
				} else {
					EXIF.getData(image, function(exifImage) {
						var orientation = EXIF.getTag(exifImage,"Orientation");
						var sceneType = EXIF.getTag(exifImage,"SceneCaptureType");
						if(typeof orientation != 'number') orientation = 1;
						BarcodeScanner.BarcodeScannerDecodeImage(exifImage,orientation,sceneType);
					});
				}
			} else {
				var img = new Image();
				img.onload = function() {
					if(BarcodeScanner.Config.SkipOrientation) {
						BarcodeScanner.BarcodeScannerDecodeImage(img,1,"");
					} else {
						EXIF.getData(this, function(exifImage) {
							var orientation = EXIF.getTag(exifImage,"Orientation");
							var sceneType = EXIF.getTag(exifImage,"SceneCaptureType");
							if(typeof orientation != 'number') orientation = 1;
							BarcodeScanner.BarcodeScannerDecodeImage(exifImage,orientation,sceneType);
						});
					}
				};
				img.src = image.src;
			}
		} else {
			var img = new Image();
			img.onload = function() {
				if(BarcodeScanner.Config.SkipOrientation) {
					BarcodeScanner.BarcodeScannerDecodeImage(img,1,"");
				} else {
					EXIF.getData(this, function(exifImage) {
						var orientation = EXIF.getTag(exifImage,"Orientation");
						var sceneType = EXIF.getTag(exifImage,"SceneCaptureType");
						if(typeof orientation != 'number') orientation = 1;
						BarcodeScanner.BarcodeScannerDecodeImage(exifImage,orientation,sceneType);
					});
				}
			};
			img.src = image;
		}
	},
	
	// Starts the decoding of a stream, the stream is a video not a blob i.e it's an element.
	DecodeStream : function(stream) {
		BarcodeScanner.Stream = stream;
		BarcodeScanner.DecodeStreamActive = true;
		BarcodeScanner.DecoderWorker.onmessage = BarcodeScanner.BarcodeScannerStreamCallback;
		BarcodeScanner.ScanContext.drawImage(stream,0,0,BarcodeScanner.ScanCanvas.width,BarcodeScanner.ScanCanvas.height);
		BarcodeScanner.DecoderWorker.postMessage({
			scan : BarcodeScanner.ScanContext.getImageData(0,0,BarcodeScanner.ScanCanvas.width,BarcodeScanner.ScanCanvas.height).data,
			scanWidth : BarcodeScanner.ScanCanvas.width,
			scanHeight : BarcodeScanner.ScanCanvas.height,
			multiple : BarcodeScanner.Config.Multiple,
			decodeFormats : BarcodeScanner.Config.DecodeFormats,
			cmd : "normal",
			rotation : 1,
		});
	},
	
	// Stops the decoding of a stream.
	StopStreamDecode : function() {
		BarcodeScanner.DecodeStreamActive = false;
		BarcodeScanner.Decoded = [];
	},
	
	BarcodeScannerDecodeImage : function (image,orientation,sceneCaptureType) {
		if(orientation == 8 || orientation == 6) {
			if(sceneCaptureType == "Landscape" && image.width > image.height) {
				orientation = 1;
				BarcodeScanner.ScanCanvas.width = 640;
				BarcodeScanner.ScanCanvas.height = 480;
			} else {
				BarcodeScanner.ScanCanvas.width = 480;
				BarcodeScanner.ScanCanvas.height = 640;
			}
		} else {
			BarcodeScanner.ScanCanvas.width = 640;
			BarcodeScanner.ScanCanvas.height = 480;
		}
		BarcodeScanner.DecoderWorker.onmessage = BarcodeScanner.BarcodeScannerImageCallback;
		BarcodeScanner.ScanContext.drawImage(image,0,0,BarcodeScanner.ScanCanvas.width,BarcodeScanner.ScanCanvas.height);
		BarcodeScanner.Orientation = orientation;
		BarcodeScanner.DecoderWorker.postMessage({
			scan : BarcodeScanner.ScanContext.getImageData(0,0,BarcodeScanner.ScanCanvas.width,BarcodeScanner.ScanCanvas.height).data,
			scanWidth : BarcodeScanner.ScanCanvas.width,
			scanHeight : BarcodeScanner.ScanCanvas.height,
			multiple : BarcodeScanner.Config.Multiple,
			decodeFormats : BarcodeScanner.Config.DecodeFormats,
			cmd : "normal",
			rotation : orientation,
			postOrientation : BarcodeScanner.PostOrientation
		});
	},
	
	DetectVerticalSquash : function (img) {
    	var ih = img.naturalHeight;
    	var canvas = BarcodeScanner.SquashCanvas;
    	canvas.width = 1;
    	canvas.height = ih;
    	var ctx = canvas.getContext('2d');
    	ctx.drawImage(img, 0, 0);
    	try {
        	var data = ctx.getImageData(0, 0, 1, ih).data;
    	} catch (err) {
        	console.log("Cannot check verticalSquash: CORS?");
        	return 1;
    	}
    	var sy = 0;
    	var ey = ih;
    	var py = ih;
    	while (py > sy) {
        	var alpha = data[(py - 1) * 4 + 3];
        	if (alpha === 0) {
        	    ey = py;
        	} else {
            	sy = py;
        	}
        	py = (ey + sy) >> 1;
    	}
    	var ratio = (py / ih);
    	return (ratio===0)?1:ratio;
	},
	
	FixCanvas : function (canvas)
	{
    	var ctx = canvas.getContext('2d');
    	var drawImage = ctx.drawImage;
    	ctx.drawImage = function(img, sx, sy, sw, sh, dx, dy, dw, dh)
    	{
        	var vertSquashRatio = 1;
        	if (Boolean(img) && img.nodeName == 'IMG')
        	{
            	vertSquashRatio = BarcodeScanner.DetectVerticalSquash(img);
            	sw || (sw = img.naturalWidth);
            	sh || (sh = img.naturalHeight);
        	}
        	if (arguments.length == 9)
            	drawImage.call(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
        	else if (typeof sw != 'undefined')
            	drawImage.call(ctx, img, sx, sy, sw, sh / vertSquashRatio);
        	else
            	drawImage.call(ctx, img, sx, sy);
    	};
    	return canvas;
	}
};
