deploy: build
	s3cmd sync build/. s3://desandro.com
