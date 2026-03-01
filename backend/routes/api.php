use App\Http\Controllers\UniversityController;
use App\Http\Controllers\CampusController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\UserController;

Route::apiResource('users', UserController::class);
Route::apiResource('universities', UniversityController::class);
Route::apiResource('campuses', CampusController::class);
Route::apiResource('courses', CourseController::class);