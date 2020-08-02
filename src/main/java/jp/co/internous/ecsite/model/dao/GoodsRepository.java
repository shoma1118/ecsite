package jp.co.internous.ecsite.model.dao;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jp.co.internous.ecsite.model.entity.Goods;


@Repository
public interface GoodsRepository extends JpaRepository<Goods, Long> {
	
}
