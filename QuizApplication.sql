CREATE DATABASE QuizApplication;
GO

USE QuizApplication;
GO

/****** Table: tbl_Users ******/
CREATE TABLE [dbo].[tbl_Users] (
    UserId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    UserName NVARCHAR(50) NOT NULL UNIQUE,
    UserPass VARBINARY(100) NOT NULL,
    FullName NVARCHAR(100) NULL,
	Gender NVARCHAR(10) NULL,
	Phone VARCHAR(10) NULL,
    UserRole TINYINT NOT NULL, -- 1: Học sinh, 2: Giảng viên, 3: Admin
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL
);
GO

/****** Table: tbl_Quizzes ******/
CREATE TABLE [dbo].[tbl_Quizzes] (
    QuizId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    QuizName NVARCHAR(200) NOT NULL,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL,
    CONSTRAINT FK_Quizzes_Users FOREIGN KEY (CreatedBy) REFERENCES [dbo].[tbl_Users](UserId)
);
GO

/****** Table: tbl_Questions ******/
CREATE TABLE [dbo].[tbl_Questions] (
    QuestionId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    QuizId INT NOT NULL,
    QuestionText NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL,
    CONSTRAINT FK_Questions_Quizzes FOREIGN KEY (QuizId) REFERENCES [dbo].[tbl_Quizzes](QuizId) ON DELETE CASCADE
);
GO

/****** Table: tbl_Answers ******/
CREATE TABLE [dbo].[tbl_Answers] (
    AnswerId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    QuestionId INT NOT NULL,
    AnswerText NVARCHAR(MAX) NOT NULL,
    IsCorrect BIT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME NULL,
    CONSTRAINT FK_Answers_Questions FOREIGN KEY (QuestionId) REFERENCES [dbo].[tbl_Questions](QuestionId) ON DELETE CASCADE
);
GO

/****** Table: tbl_QuizParticipants ******/
CREATE TABLE [dbo].[tbl_QuizParticipants] (
    ParticipantId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    QuizId INT NOT NULL,
    UserId INT NOT NULL,
    ParticipationDate DATETIME DEFAULT GETDATE(),
    Score INT NULL,
    CONSTRAINT FK_QuizParticipants_Quizzes FOREIGN KEY (QuizId) REFERENCES [dbo].[tbl_Quizzes](QuizId) ON DELETE CASCADE,
    CONSTRAINT FK_QuizParticipants_Users FOREIGN KEY (UserId) REFERENCES [dbo].[tbl_Users](UserId) ON DELETE CASCADE
);
GO

/****** Table: tbl_QuizResults ******/
CREATE TABLE [dbo].[tbl_QuizResults] (
    ResultId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    ParticipantId INT NOT NULL,
    Score INT NOT NULL,
    CompletedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_QuizResults_QuizParticipants FOREIGN KEY (ParticipantId) REFERENCES [dbo].[tbl_QuizParticipants](ParticipantId) ON DELETE CASCADE
);
GO

/****** Table: tbl_Categories ******/
CREATE TABLE [dbo].[tbl_Categories] (
    CategoryId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL
);
GO

/****** Table: tbl_QuizCategories ******/
CREATE TABLE [dbo].[tbl_QuizCategories] (
    QuizId INT NOT NULL,
    CategoryId INT NOT NULL,
    PRIMARY KEY (QuizId, CategoryId),
    CONSTRAINT FK_QuizCategories_Quizzes FOREIGN KEY (QuizId) REFERENCES [dbo].[tbl_Quizzes](QuizId) ON DELETE CASCADE,
    CONSTRAINT FK_QuizCategories_Categories FOREIGN KEY (CategoryId) REFERENCES [dbo].[tbl_Categories](CategoryId) ON DELETE CASCADE
);
GO

-- Chèn tài khoản Admin
INSERT INTO [dbo].[tbl_Users] (UserName, UserPass, UserRole)
VALUES 
('admin',PWDENCRYPT('123'), 3);

-- Chèn một số tài khoản Học sinh và Giảng viên
INSERT INTO [dbo].[tbl_Users] (UserName, UserPass, UserRole)
VALUES 
('vantuan', PWDENCRYPT('123'), 1),
('vantuangv', PWDENCRYPT('123'), 2)

SELECT * FROM [dbo].[tbl_Users];
SELECT * FROM [dbo].[tbl_Categories];
SELECT * FROM [dbo].[tbl_Quizzes];
SELECT * FROM [dbo].[tbl_Questions];
SELECT * FROM [dbo].[tbl_Answers];
SELECT * FROM [dbo].[tbl_QuizCategories];
SELECT * FROM [dbo].[tbl_QuizParticipants];
SELECT * FROM [dbo].[tbl_QuizResults];
GO