CREATE DATABASE employeeResponseDB;

CREATE TABLE Survey (
	SurveyID	INT(12) AUTO_INCREMENT NOT NULL,
	Sname		Varchar(200),
	RLock 		int NOT NULL,
	DLock 		int NOT NULL,
	PRIMARY KEY (SurveyID)
);

CREATE TABLE Region (
	RegionID	INT(12) AUTO_INCREMENT NOT NULL,
	Country		Varchar(200) NOT NULL,
	RegionName	Varchar(200) NOT NULL,
	PRIMARY KEY (RegionID)
);

CREATE TABLE Division (
	DivisionID		INT(12) AUTO_INCREMENT NOT NULL,
	DivisionName	Varchar(200) NOT NULL,
	PRIMARY KEY	(DivisionID)
);
ALTER TABLE User(
ADD Username Varchar(200) NOT NULL
);
CREATE TABLE User (
	UserID		INT(12) AUTO_INCREMENT NOT NULL,
	Fname		Varchar(200) NOT NULL,
	Lname		Varchar(200) NOT NULL,
	Email		Varchar(200) NOT NULL,
	Password	Varchar(200) NOT NULL,
	DivisionID	INT(12),
	RegionID	INT(12),
	PRIMARY KEY (UserID),
	FOREIGN KEY (DivisionID) REFERENCES Division(DivisionID),
	FOREIGN KEY (RegionID) REFERENCES Region(RegionID)
);

CREATE TABLE Question (
	QuestionID		INT(12) AUTO_INCREMENT NOT NULL,
	SurveyID		INT(12),
	QuestionText	TEXT NOT NULL,
	PRIMARY KEY (QuestionID),
	FOREIGN KEY (SurveyID) REFERENCES Survey(SurveyID)
);

CREATE TABLE Result (
	RegionID			INT(12) AUTO_INCREMENT NOT NULL,
	QuestionID			INT(12), 
	SurveyID			INT(12), 
	UserID				INT(12), 
	Result				INT(12) NOT NULL,
	HasFeedback			INT NOT NULL,
	PRIMARY KEY (RegionID),
	FOREIGN KEY (QuestionID) REFERENCES Question(QuestionID),
	FOREIGN KEY (SurveyID) REFERENCES Survey(SurveyID),
	FOREIGN KEY (UserID) REFERENCES User(UserID)
);

CREATE TABLE Answers (
	AnswerID	INT(4) NOT NULL PRIMARY KEY,
	AnswerText TEXT NOT NULL
);

CREATE TABLE Feedback (
	FeedbackID			INT(12) AUTO_INCREMENT NOT NULL,
	QuestionID			INT(12), 
	SurveyID			INT(12), 
	UserID				INT(12), 
	FeedbackText		TEXT NOT NULL,
	Tags				TEXT NOT NULL,
	PRIMARY KEY (FeedbackID),
	FOREIGN KEY (QuestionID) REFERENCES Question(QuestionID),
	FOREIGN KEY (SurveyID) REFERENCES Survey(SurveyID),
	FOREIGN KEY (UserID) REFERENCES User(UserID)
);

CREATE TABLE SurveyCompletion (
	UserID				INT(12) NOT NULL, 
	SurveyID			INT(12) NOT NULL, 
	DateCompleted		DATETIME NOT NULL DEFAULT NOW(),
	PRIMARY KEY (UserID, SurveyID),
	FOREIGN KEY (UserID) REFERENCES User(UserID),
	FOREIGN KEY (SurveyID) REFERENCES Survey(SurveyID)
);

CREATE TABLE DivisionLock (
	SurveyID			INT(12) NOT NULL, 
	DivisionID			INT(12) NOT NULL, 
	PRIMARY KEY (SurveyID, DivisionID),
	FOREIGN KEY (SurveyID) REFERENCES Survey(SurveyID),
	FOREIGN KEY (DivisionID) REFERENCES Division(DivisionID)
);

CREATE TABLE RegionLock (
	SurveyID		INT(12) NOT NULL, 
	RegionID		INT(12) NOT NULL, 
	PRIMARY KEY (SurveyID, RegionID),
	FOREIGN KEY (SurveyID) REFERENCES Survey(SurveyID),
	FOREIGN KEY (RegionID) REFERENCES Region(RegionID)
);
/*
CREATE TABLE SurveyRating (
	--RatingID		INT(12) AUTO_INCREMENT NOT NULL,
	SurveyID		INT(12) NOT NULL,
	Rating 			INT(12)	NOT NULL, 
	--PRIMARY KEY (RatingID),
	FOREIGN KEY (SurveyID) REFERENCES Survey(SurveyID)
	CHECK ( 0 <= Rating <= 5)
);
*/
CREATE TABLE SurveyRating (
	SurveyID		INT(12) NOT NULL,
	Rating 			INT(12)	NOT NULL, 
	CONSTRAINT CHK_Rating CHECK ( 0 <= Rating <= 5),
	FOREIGN KEY (SurveyID) REFERENCES Survey(SurveyID)
);