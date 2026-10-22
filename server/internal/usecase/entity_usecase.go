package usecase

import (
	"test-muhammad-anas/internal/data/model"
	"test-muhammad-anas/internal/data/repository"
	"test-muhammad-anas/internal/dto"
	"time"
)

type EntityUsecase interface {
	GetAll() ([]dto.EntityResponse, error)
	GetByID(id int64) (*dto.EntityResponse, error)
	Create(req *dto.EntityRequest) (*dto.EntityResponse, error)
	Update(id int64, req *dto.EntityRequest) (*dto.EntityResponse, error)
	Delete(id int64) error
}

type entityUsecase struct {
	repo repository.EntityRepository
}

func NewEntityUsecase(repo repository.EntityRepository) EntityUsecase {
	return &entityUsecase{repo: repo}
}

func mapToResponse(m *model.Entity) dto.EntityResponse {
	return dto.EntityResponse{
		ID: m.ID, Name: m.Name, Type: m.Type, Status: m.Status,
		Latitude: m.Latitude, Longitude: m.Longitude, Description: m.Description,
		CreatedAt: m.CreatedAt, UpdatedAt: m.UpdatedAt,
	}
}

func (u *entityUsecase) GetAll() ([]dto.EntityResponse, error) {
	models, err := u.repo.GetAll()
	if err != nil {
		return nil, err
	}
	var res []dto.EntityResponse
	for _, m := range models {
		res = append(res, mapToResponse(&m))
	}
	return res, nil
}

func (u *entityUsecase) GetByID(id int64) (*dto.EntityResponse, error) {
	m, err := u.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	res := mapToResponse(m)
	return &res, nil
}

func (u *entityUsecase) Create(req *dto.EntityRequest) (*dto.EntityResponse, error) {
	now := time.Now().UTC()
	m := &model.Entity{
		Name: req.Name, Type: req.Type, Status: req.Status,
		Latitude: *req.Latitude, Longitude: *req.Longitude, Description: req.Description,
		CreatedAt: now, UpdatedAt: now,
	}
	if err := u.repo.Create(m); err != nil {
		return nil, err
	}
	res := mapToResponse(m)
	return &res, nil
}

func (u *entityUsecase) Update(id int64, req *dto.EntityRequest) (*dto.EntityResponse, error) {
	m := &model.Entity{
		ID: id, Name: req.Name, Type: req.Type, Status: req.Status,
		Latitude: *req.Latitude, Longitude: *req.Longitude, Description: req.Description,
		UpdatedAt: time.Now().UTC(),
	}
	if err := u.repo.Update(m); err != nil {
		return nil, err
	}
	// Balikin data terbaru dari DB
	return u.GetByID(id)
}

func (u *entityUsecase) Delete(id int64) error {
	return u.repo.Delete(id)
}
