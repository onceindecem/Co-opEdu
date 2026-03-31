import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { UpdateHRProfileDto } from './dto/update-hr-profile.dto';
import { HR } from './entities/hr.entity';
import { Company } from '../company/entities/company.entity';

@Injectable()
export class HrService {
  constructor(
    @InjectModel(HR)
    private hrModel: typeof HR,
    @InjectModel(Company)
    private companyModel: typeof Company,
    private sequelize: Sequelize,
  ) {}

  async updateHrProfile(userID: string, updateData: any) {
    const t = await this.sequelize.transaction();
    console.log('Updating HR profile for userID:', userID);
    console.log('Update data:', updateData);

    try {
      // find HR profile by userID
      const hrProfile = await this.hrModel.findOne({ 
        where: { userID: userID } 
      });

      if (!hrProfile) {
        throw new HttpException('HR profile not found', HttpStatus.NOT_FOUND);
      }

      // update HR profile with new data 
      await hrProfile.update({
        hrFirstName: updateData.hrFirstName ?? hrProfile.hrFirstName,
        hrLastName: updateData.hrLastName ?? hrProfile.hrLastName,
        hrPosition: updateData.hrPosition ?? hrProfile.hrPosition,
        hrTel: updateData.hrTel ?? hrProfile.hrTel,
      }, { transaction: t });

      // update company info if coID exists in HR profile and update data contains company fields
      if (hrProfile.coID) {
        const company = await this.companyModel.findOne({ 
          where: { coID: hrProfile.coID } 
        });

        if (company) {
          await company.update({
            coNameTH: updateData.coNameTH ?? company.coNameTH,
            coNameEN: updateData.coNameEN ?? company.coNameEN,
            coEmail: updateData.coEmail ?? company.coEmail,
            coTel: updateData.coTel ?? company.coTel,
            coAddr: updateData.coAddr ?? company.coAddr,
          }, { transaction: t });
        }
      }

      // commit transaction
      await t.commit();

      return { 
        message: 'HR profile updated successfully',
        updatedProfile: hrProfile, 
      };

    } catch (error) {
      await t.rollback();
      throw new HttpException(
        'Failed to update HR profile' + (error.message ? `: ${error.message}` : ''), 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll() {
    return await this.hrModel.findAll();
  }

  async findOne(id: string) {
    const hr = await this.hrModel.findByPk(id);
    if (!hr) {
      throw new NotFoundException(`HR not found`);
    }
    return hr;
  }

  async remove(id: string) {
    const hr = await this.findOne(id);
    await hr.destroy();
    return { message: `ลบ HR รหัส ${id} เรียบร้อยแล้ว` };
  }
}
