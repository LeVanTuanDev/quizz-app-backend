USE QuizApplication
GO

CREATE proc [dbo].[sp_Login]
	@UserName varchar(30),
	@PassWord varchar(50)
as
begin try
	if not exists (
		select	* 
		from [tbl_Users] 
		where UserName = @UserName and PWDCOMPARE (@PassWord, UserPass) = 1
	)
	begin
		raiserror (N'Tên đăng nhập hoặc mật khẩu không chính xác.', 16, 1)
		return
	end
	select	UserId, UserName, FullName, Gender, Phone, UserRole, CreatedAt, UpdatedAt
	from	tbl_Users
	where	UserName = @UserName
end try
begin catch
	declare @err nvarchar(1000) = ERROR_MESSAGE()
	raiserror (@err, 16, 1)
end catch
GO

CREATE PROCEDURE [dbo].[sp_Register]
    @UserName NVARCHAR(50),
    @PassWord NVARCHAR(50),
    @UserRole TINYINT
AS
BEGIN TRY
    -- Kiểm tra nếu tên người dùng đã tồn tại
    IF EXISTS (
        SELECT 1 
        FROM [dbo].[tbl_Users] 
        WHERE UserName = @UserName
    )
    BEGIN
        RAISERROR(N'Tên đăng nhập đã tồn tại. Vui lòng chọn tên đăng nhập khác.', 16, 1)
        RETURN
    END

    -- Thêm người dùng mới
    INSERT INTO [dbo].[tbl_Users] (UserName, UserPass, UserRole)
    VALUES (@UserName, PWDENCRYPT(@PassWord), @UserRole)

    PRINT N'Đăng ký thành công!'
END TRY
BEGIN CATCH
    DECLARE @err NVARCHAR(1000) = ERROR_MESSAGE()
    RAISERROR(@err, 16, 1)
END CATCH
GO

CREATE PROCEDURE [dbo].[sp_ChangePassword]
    @UserName NVARCHAR(50),
    @OldPassword NVARCHAR(50),
    @NewPassword NVARCHAR(50)
AS
BEGIN TRY
    -- Kiểm tra xem tên đăng nhập và mật khẩu cũ có hợp lệ không
    IF NOT EXISTS (
        SELECT 1 
        FROM [dbo].[tbl_Users] 
        WHERE UserName = @UserName AND PWDCOMPARE(@OldPassword, UserPass) = 1
    )
    BEGIN
        RAISERROR(N'Tên đăng nhập hoặc mật khẩu cũ không chính xác.', 16, 1)
        RETURN
    END

    -- Cập nhật mật khẩu mới
    UPDATE [dbo].[tbl_Users]
    SET UserPass = PWDENCRYPT(@NewPassword),
        UpdatedAt = GETDATE()
    WHERE UserName = @UserName

    PRINT N'Đổi mật khẩu thành công!'
END TRY
BEGIN CATCH
    DECLARE @err NVARCHAR(1000) = ERROR_MESSAGE()
    RAISERROR(@err, 16, 1)
END CATCH
GO

CREATE PROCEDURE [dbo].[sp_DeleteUser]
    @UserId INT,
    @UserName NVARCHAR(50)
AS
BEGIN TRY
    IF NOT EXISTS (
        SELECT 1 
        FROM [dbo].[tbl_Users] 
        WHERE UserName = @UserName
    )
    BEGIN
        RAISERROR(N'Người dùng không tồn tại. Vui lòng kiểm tra lại!', 16, 1)
        RETURN
    END

    -- Xóa người dùng
    DELETE FROM [dbo].[tbl_Users]
    WHERE UserId = @UserId

    SELECT N'Xóa người dùng thành công!' AS Message;
END TRY
BEGIN CATCH
    DECLARE @err NVARCHAR(1000) = ERROR_MESSAGE()
    RAISERROR(@err, 16, 1)
END CATCH
GO


CREATE PROCEDURE [dbo].[sp_UpdateUser]
    @UserName NVARCHAR(50),
    @FullName NVARCHAR(100) = NULL,
    @Gender NVARCHAR(10) = NULL,
    @Phone VARCHAR(10) = NULL
AS
BEGIN TRY
    -- Kiểm tra xem người dùng có tồn tại hay không
    IF NOT EXISTS (
        SELECT 1 
        FROM [dbo].[tbl_Users] 
        WHERE UserName = @UserName
    )
    BEGIN
        RAISERROR(N'Người dùng không tồn tại.', 16, 1)
        RETURN
    END

    -- Cập nhật thông tin người dùng
    UPDATE [dbo].[tbl_Users]
    SET FullName = ISNULL(@FullName, FullName),
        Gender = ISNULL(@Gender, Gender),
        Phone = ISNULL(@Phone, Phone),
        UpdatedAt = GETDATE()
    WHERE UserName = @UserName

    PRINT N'Cập nhật thông tin thành công!'
END TRY
BEGIN CATCH
    DECLARE @err NVARCHAR(1000) = ERROR_MESSAGE()
    RAISERROR(@err, 16, 1)
END CATCH
GO

/****** Thủ tục: sp_GetAllUsers ******/
CREATE PROCEDURE [dbo].[sp_GetAllUsers]
AS
BEGIN TRY
    SELECT 
        UserId,
        UserName,
        FullName,
        Gender,
        Phone,
        UserRole
    FROM [dbo].[tbl_Users]
    ORDER BY UserId

    PRINT N'Lấy danh sách tất cả người dùng thành công!'
END TRY
BEGIN CATCH
    DECLARE @err NVARCHAR(1000) = ERROR_MESSAGE()
    RAISERROR(@err, 16, 1)
END CATCH
GO

/****** Thủ tục: sp_GetUserById ******/
CREATE PROCEDURE [dbo].[sp_GetUserById]
    @UserId INT
AS
BEGIN TRY
    IF NOT EXISTS (
        SELECT 1 
        FROM [dbo].[tbl_Users] 
        WHERE UserId = @UserId
    )
    BEGIN
        RAISERROR(N'Người dùng không tồn tại.', 16, 1)
        RETURN
    END

    SELECT 
        UserName,
        FullName,
        Gender,
        Phone,
        UserRole
    FROM [dbo].[tbl_Users]
    WHERE UserId = @UserId

    PRINT N'Lấy thông tin người dùng thành công!'
END TRY
BEGIN CATCH
    DECLARE @err NVARCHAR(1000) = ERROR_MESSAGE()
    RAISERROR(@err, 16, 1)
END CATCH
GO